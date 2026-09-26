import json,subprocess,sys,os
d=json.load(open('cache/cands.json'))
ids=sys.argv[2:] ; out=sys.argv[1]
args=[]
for pid in ids:
    for i in range(6):
        f=f'cache/cands/{pid}_{i}.jpg'
        args += ['-label', f'{pid} #{i}', f if (i<len(d.get(pid,[])) and os.path.exists(f)) else 'xc:gray']
subprocess.run(['montage',*args,'-tile','6x','-geometry','250x165+3+3','-pointsize','13','-background','white',out],check=True)
