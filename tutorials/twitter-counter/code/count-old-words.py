from TwitterAPI import TwitterAPI, TwitterRestPager


WORDS_TO_COUNT = ['pizza', 'terror', 'plywood']


API_KEY = '<use yours>'
API_SECRET = '<use yours>'
ACCESS_TOKEN = '<use yours>'
ACCESS_TOKEN_SECRET = '<use yours>'


api = TwitterAPI(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
words = ' OR '.join(WORDS_TO_COUNT)
counts = dict((word,0) for word in WORDS_TO_COUNT)


def process_tweet(text):
	text = text.lower()
	for word in WORDS_TO_COUNT:
		if word in text:
			counts[word] += 1
	print(counts)


r = TwitterRestPager(api, 'search/tweets', {'q':words, 'count':100})
for item in r.get_iterator(wait=6):
	if 'text' in item:
		process_tweet(item['text'])
	elif 'message' in item and item['code'] == 88:
		print('\n*** SUSPEND, RATE LIMIT EXCEEDED: %s\n' % item['message'])
		break


