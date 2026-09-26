import json,sys,urllib.request,urllib.parse,time
for q in sys.argv[1:]:
    u='https://nominatim.openstreetmap.org/search?'+urllib.parse.urlencode({'q':q,'format':'json','limit':2,'countrycodes':'jp'})
    try: r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'trip-planner/1.0'}),timeout=30))
    except Exception as e: r=[]; print(q,'ERR',e)
    for x in r[:2]: print(f"{q} | {float(x['lat']):.5f},{float(x['lon']):.5f} | {x['display_name'][:90]}")
    if not r: print(q,'| none')
    time.sleep(1.1)
