"""Merges the research helpers' option files (scripts/ideas/*.json) into src/data/ideas.json."""
import json, glob, os
REQ=['id','kind','category','title','titleJa','summary','why','days','duration','cost','winter','lat','lon']
fixes=json.load(open('ideas/fixes.json')) if os.path.exists('ideas/fixes.json') else {}
# "What you will do there" texts, one file per area (planned places go to their own file)
exp={}
for f in glob.glob('ideas/experience-*.json'):
    try: exp.update(json.load(open(f)))
    except Exception as e: print('BAD JSON',f,e)
# Clean-up decisions: ideas removed from the list, with the reason (kept for the record in src/data/removed.json)
removed={}
for f in glob.glob('ideas/clean-*.json'):
    try: removed.update(json.load(open(f)).get('remove',{}))
    except Exception as e: print('BAD JSON',f,e)
out=[]; seen=set()
for f in sorted(glob.glob('ideas/*.json')):
    area=os.path.basename(f)[:-5]
    if area in ('choices','fixes','photo-picks','all-ideas') or area.startswith(('experience-','photo-picks-','clean-')): continue
    try: data=json.load(open(f))
    except Exception as e: print('BAD JSON',f,e); continue
    for o in data:
        o={**o,**fixes.get(o.get('id'),{})}
        miss=[k for k in REQ if k not in o]
        if miss: print('skip',area,o.get('id'),'missing',miss); continue
        if o['id'] in seen: o['id']=f"{area}-{o['id']}"
        seen.add(o['id'])
        o['area']=area; o.setdefault('winterNote',''); o.setdefault('sources',[])
        o['days']=[int(d) for d in o['days'] if str(d).isdigit()]
        if o['kind'] not in ('addon','swap','plan'): o['kind']='addon'
        if o['winter'] not in ('ok','check','no'): o['winter']='check'
        if o['id'] in removed: continue
        if o['id'] in exp: o['experience']=exp[o['id']]
        out.append(o)
json.dump(out,open('../src/data/ideas.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print(len(out),'ideas', Counter(o['area'] for o in out), 'with experience:', sum('experience' in o for o in out))

planned={}
for f in glob.glob('ideas/experience-planned-*.json'):
    try: planned.update(json.load(open(f)))
    except Exception as e: print('BAD JSON',f,e)
json.dump(planned,open('../src/data/plannedExperience.json','w'),ensure_ascii=False,indent=1)
print('planned places with experience:',len(planned))

json.dump(removed,open('../src/data/removed.json','w'),ensure_ascii=False,indent=1)
print('removed:',len(removed))
