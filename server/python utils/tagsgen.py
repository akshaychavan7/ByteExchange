import yake

def formal_keywords(keywords):
    for key in range(len(keywords)):
        if len(keywords[key].split()) > 1:
            keywords[key] = keywords[key].replace(' ', '-')
    return keywords

def final_tags_gen(keywords, tags, finaltags):
    for key in keywords:
        for tag in tags:
            if key in tag:
                finaltags.add(tag)
    for key in keywords:
        if len(finaltags) == 5:
            break
        finaltags.add(key)
    return finaltags

def findtags(text, tags):
    numkeywords = 20
    max_ngram_size = 2
    custom_kw_extractor = yake.KeywordExtractor(n=max_ngram_size, top=numkeywords)
    keywords = custom_kw_extractor.extract_keywords(text)
    keywords = [key[0].lower() for key in keywords]
    keywords = formal_keywords(keywords)
    finaltags = set()
    return final_tags_gen(keywords, tags, finaltags)