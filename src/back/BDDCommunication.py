from back.Exercice import Exercice
from back.Histoire import Histoire
from shared import SRC_DIRECTORY
import json

class BDDCommunication():
    srcBDD : str
    storyFileName : str
    exosFileName : str
    advancedStoryFileName : str
    
    stories : list[Histoire]
    exos : list[Exercice]
    nbExos : int = 5
    
    def __init__(self, srcJsonBDD : str, storyFileName :str, exosFileName : str, advancedStoryFileName : str = None):
        self.srcBDD = srcJsonBDD
        self.storyFileName = storyFileName
        self.exosFileName = exosFileName
        self.advancedStoryFileName = advancedStoryFileName
        
        self.getStories()
        self.getExos()
    
    def _openFile(self, fileName : str, filter : str = None):
        """Opens a JSON file and returns a list of its objects."""
        try:
            with open(SRC_DIRECTORY+"/"+self.srcBDD+fileName, "r", encoding="utf-8") as file:
                data = json.load(file)
                if isinstance(data, dict) and filter != None:
                    if filter in data:
                        return data[filter]
                    else : return []
                return data  
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading JSON file: {e}")
            return []
        
    # Méthode de renvoie des JSON
    
    def getStoriesJson(self, lang : str) -> dict:
        """Renvoie une histoire au format JSON selon la langue spécifiée"""
        # Vérifier d'abord si une histoire avancée est disponible
        if self.advancedStoryFileName:
            advanced_story = self._getAdvancedStoryJson()
            if advanced_story and (not lang or advanced_story.get("language", "").lower() == lang.lower()):
                return advanced_story
        
        # Si pas d'histoire avancée ou langue différente, utiliser le format standard
        data = self._openFile(self.storyFileName)
        for s in data:
            if data[s]["language"].lower() == lang.lower():
                data[s]["list"][0]["type"] = "History"
                return data[s]["list"][0]
        return {}
    
    def _getAdvancedStoryJson(self, lang="English") -> dict:
        """Renvoie l'histoire au format avancé avec phrases et émotions selon la langue spécifiée"""
        if not self.advancedStoryFileName:
            return None
            
        data = self._openFile(self.advancedStoryFileName)
        if not data:
            return None
        
        # Déterminer quelle clé de langue utiliser
        lang_key = "en" if lang.lower() == "english" else "fr"
        
        # Vérifier si la clé de langue existe dans les données
        if lang_key not in data:
            # Si la langue demandée n'est pas disponible, utiliser la première langue disponible
            lang_key = next(iter(data))
        
        # Récupérer les données de l'histoire dans la langue spécifiée
        story_data_lang = data[lang_key]
        
        # Convertir au format attendu par le front-end
        story_data = {
            "type": "History",
            "title": story_data_lang.get("title", "Story"),
            "content": " ".join([s["text"] for s in story_data_lang.get("sentences", [])]),
            "language": story_data_lang.get("language", "English"),
            "advanced_format": True,
            "sentences": story_data_lang.get("sentences", []),
            "sentence_count": len(story_data_lang.get("sentences", []))
        }
        
        return story_data
    
    def getExosJson(self) -> dict:
        equations = self.getExos()
        exercise_data = {
            "type": "Maths",
            "nb_exos": len(equations),
            "exercices": [{"equation": eq.equation} for eq in equations]
        }
        json_string = json.dumps(exercise_data, indent=4)
        return json_string
        
    # Methode de récupération des éléments dans le JSON
    
    def getStories(self) -> list[Histoire]:
        """Récupère toutes les histoires (format standard et avancé)"""
        self.stories: list[Histoire] = []
        
        # Format standard
        data = self._openFile(self.storyFileName)
        for lang in data:
            for s in data[lang]["list"]:
                newStory = Histoire.from_format_standard(s["title"], s["content"], data[lang]["language"])
                self.stories.append(newStory)
        
        # Format avancé si disponible
        if self.advancedStoryFileName:
            advanced_data = self._openFile(self.advancedStoryFileName)
            if advanced_data:
                advanced_story = Histoire.from_format_avance(
                    advanced_data.get("title", "Story"),
                    advanced_data.get("language", "English"),
                    advanced_data.get("sentences", [])
                )
                self.stories.append(advanced_story)
                
        return self.stories
        
    def getFilteredStories(self, filter : str) -> list[Histoire]:
        stories: list[Histoire] = []
        data = self._openFile(self.storyFileName, filter)
        for s in data["list"]:
            newStory = Histoire.from_format_standard(s["title"], s["content"], data["language"])
            stories.append(newStory)
        return stories
        
    def getExos(self) -> list[Exercice]:
        self.exos : list[Exercice] = []
        for i in range(self.nbExos):
            exo = Exercice()
            exo.generateExercicePos(3,3)
            self.exos.append(exo)
        return self.exos
        
    def getStorie(self, storyTitle : str) -> Histoire:
        # Recherche dans les histoires standard
        for story in self.stories:
            if story.titre == storyTitle:
                return story
        
        # Si aucune histoire trouvée
        return None
        
    def getAdvancedStory(self) -> Histoire:
        """Récupère l'histoire au format avancé (avec phrases et émotions)"""
        if not self.advancedStoryFileName:
            return None
            
        advanced_data = self._openFile(self.advancedStoryFileName)
        if not advanced_data:
            return None
            
        return Histoire.from_format_avance(
            advanced_data.get("title", "Story"),
            advanced_data.get("language", "English"),
            advanced_data.get("sentences", [])
        )