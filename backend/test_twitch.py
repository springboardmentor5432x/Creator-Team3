import requests
headers = {'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'}
query = """
query {
    user(login: "ninja") {
        id
        login
        stream {
            viewersCount
        }
        videos(first: 5, sort: TIME) {
            edges {
                node {
                    viewCount
                    lengthSeconds
                }
            }
        }
    }
}
"""
res = requests.post('https://gql.twitch.tv/gql', json={'query': query}, headers=headers)
print(res.text[:800])
