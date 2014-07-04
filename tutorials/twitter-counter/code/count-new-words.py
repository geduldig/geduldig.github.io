from TwitterAPI import TwitterAPI


WORDS_TO_COUNT = ['pizza', 'hamburger', 'plywood']


API_KEY = XXX
API_SECRET = XXX
ACCESS_TOKEN = XXX
ACCESS_TOKEN_SECRET = XXX


api = TwitterAPI(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
words = ','.join(WORDS_TO_COUNT)
counts = dict((word,0) for word in WORDS_TO_COUNT)
total_skip = 0


def process_tweet(text):
	text = text.lower()
	for word in WORDS_TO_COUNT:
		if word in text:
			counts[word] += 1
	print(counts)


while True:
  skip = 0
	try:
		r = api.request('statuses/filter', {'track':words})
		while True:
			for item in r.get_iterator():
				if 'text' in item:
						process_tweet(item['text'])
				elif 'limit' in item:
					skip = item['limit'].get('track')
					print('\n\n\n*** Skipped %d tweets\n\n\n' % (total_skip + skip))
				elif 'disconnect' in item:
					raise Exception('Disconnect: %s' % item['disconnect'].get('reason'))
	except Exception as e:
		print('*** MUST RECONNECT %s\n' % e)
	total_skip += skip
