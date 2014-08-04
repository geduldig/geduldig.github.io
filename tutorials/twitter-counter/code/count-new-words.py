from TwitterAPI import TwitterAPI


WORDS_TO_COUNT = ['pizza', 'terror', 'plywood']


API_KEY = '<use yours>'
API_SECRET = '<use yours>'
ACCESS_TOKEN = '<use yours>'
ACCESS_TOKEN_SECRET = '<use yours>'


api = TwitterAPI(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
words = ','.join(WORDS_TO_COUNT)
counts = dict((word,0) for word in WORDS_TO_COUNT)


def process_tweet(text):
	text = text.lower()
	for word in WORDS_TO_COUNT:
		if word in text:
			counts[word] += 1
	print(counts)


r = api.request('statuses/filter', {'track':words})
for item in r:
	if 'text' in item:
		process_tweet(item['text'])
	elif 'limit' in item:
		skip = item['limit'].get('track')
		print('\n*** SKIPPED %d TWEETS\n' % skip)
	elif 'disconnect' in item:
		print('[disconnect] %s' % item['disconnect'].get('reason'))
		break