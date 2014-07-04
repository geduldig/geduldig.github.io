from TwitterAPI import TwitterAPI, TwitterRestPager


WORDS_TO_COUNT = ['pizza', 'hamburger', 'plywood']


API_KEY = XXX
API_SECRET = XXX
ACCESS_TOKEN = XXX
ACCESS_TOKEN_SECRET = XXX


api = TwitterAPI(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
words = ' OR '.join(WORDS_TO_COUNT)
counts = dict((word,0) for word in WORDS_TO_COUNT)


def process_tweet(text):
	text = text.lower()
	for word in WORDS_TO_COUNT:
		if word in text:
			counts[word] += 1
	print(counts)


while True:
	pager = TwitterRestPager(api, 'search/tweets', {'q':words, 'count':100})
	for item in pager.get_iterator():
		if 'text' in item:
			process_tweet(item['text'])
		elif 'message' in item:
			if item['code'] == 131:
				continue # ignore internal server error
			elif item['code'] == 88:
				print('Suspend search until %s' % search.get_quota()['reset'])
			raise Exception('Message from twitter: %s' % item['message'])


