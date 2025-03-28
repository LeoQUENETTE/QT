from back.Exercice import Exercice
from back.Histoire import Histoire
import json


class BDDCommunication():
    srcBDD : str
    storyFileName : str
    exosFileName : str
    
    stories : list[Histoire]
    exos : list[Exercice]
    def __init__(self, srcJsonBDD : str, storyFileName :str, exosFileName : str):
        self.srcBDD = srcJsonBDD
        self.storyFileName = storyFileName
        self.exosFileName = exosFileName
        
        self.getStories()
        self.getExos()
    
    def _openFile(self, fileName : str, filter : str = None):
        """Opens a JSON file and returns a list of its objects."""
        try:
            with open("./"+self.srcBDD+fileName, "r", encoding="utf-8") as file:
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
        data = self._openFile(self.storyFileName)
        for s in data:
            if data[s]["language"] == lang:
                data[s]["list"][0]["type"] = "History"
                return data[s]["list"][0]
        return {}
    
    def getExosJson(self) -> dict:
        return self._openFile(self.exosFileName)
        
    # Methode de récupération des éléments dans le JSON
    
    def getStories(self) -> list[Histoire]:
        self.stories: list[Histoire] = []
        data = self._openFile(self.storyFileName)
        for lang in  data:
            for s in data[lang]["list"]:
                newStory = Histoire(s["title"], s["content"], data[lang]["language"])
                self.stories.append(newStory)
        return self.stories
    def getFilteredStories(self, filter : str) -> list[Histoire]:
        stories: list[Histoire] = []
        data = self._openFile(self.storyFileName, filter)
        for s in data["list"]:
            newStory = Histoire(s["title"], s["content"], data["language"])
            stories.append(newStory)
        return stories
    def getExos(self) -> list[Exercice]:
        self.exos : list[Exercice] = []
        data = self._openFile(self.exosFileName)
        for ex in data["exercices"]:
            newExos = Exercice(ex["equation1"],ex["equation2"],ex["reponse"])
            self.exos.append(newExos)
        return self.exos
    def getStorie(self, storyTitle : str) -> Histoire:
        pass