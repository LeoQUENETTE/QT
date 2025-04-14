class Histoire():
    titre : str
    contenu : str
    lang : str
    sentences : list = None
    
    def __init__(self, titre : str, contenu : str, lang : str, sentences : list = None):
        self.titre = titre
        self.contenu = contenu
        self.lang = lang
        self.sentences = sentences
        
    @classmethod
    def from_format_standard(cls, titre : str, contenu : str, lang : str):
        """Crée une instance à partir du format standard (texte complet)"""
        return cls(titre, contenu, lang)
    
    @classmethod
    def from_format_avance(cls, titre : str, lang : str, sentences : list):
        """Crée une instance à partir du format avancé (phrases avec émotions)"""
        # Reconstruit le contenu complet à partir des phrases
        contenu = " ".join([sentence["text"] for sentence in sentences])
        return cls(titre, contenu, lang, sentences)
        
    def is_advanced_format(self):
        """Vérifie si l'histoire utilise le format avancé avec phrases et émotions"""
        return self.sentences is not None and len(self.sentences) > 0
    
    def get_sentence(self, index):
        """Récupère une phrase spécifique avec ses émotions"""
        if not self.is_advanced_format() or index < 0 or index >= len(self.sentences):
            return None
        return self.sentences[index]
    
    def get_sentence_count(self):
        """Renvoie le nombre total de phrases"""
        if not self.is_advanced_format():
            return 0
        return len(self.sentences)
    
    def to_dict(self):
        """Convertit l'histoire en dictionnaire pour l'API"""
        data = {
            "title": self.titre,
            "content": self.contenu,
            "language": self.lang,
            "type": "History"
        }
        
        if self.is_advanced_format():
            data["advanced_format"] = True
            data["sentences"] = self.sentences
            data["sentence_count"] = len(self.sentences)
        else:
            data["advanced_format"] = False
            
        return data