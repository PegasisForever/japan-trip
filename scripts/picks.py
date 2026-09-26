"""Writes src/data/picks.json: for each place, whose WANT it was ('aoki', 'pegasis' or 'both')."""
import json, re, glob, os
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.join(HERE,'..')
def wants(f):
    txt=open(os.path.join(ROOT,f)).read()
    for s in re.split(r'\n(?=[A-Z][A-Z ]+ \()',txt):
        if s.startswith('WANT'): return set(re.findall(r'\[([a-z0-9-]+)\] ·',s))
    return set()
A=wants('aoki-choices.txt'); P=wants('pega-choices.txt')
# Places whose ref names a different idea than the one in the choice files
ALIAS={'nara-park-todaiji':'rw3-nara-yamayaki-2027'}
plan=json.load(open(os.path.join(ROOT,'src/data/plan.json'))); out={}
for pl in plan['places']:
    keys={k for k in (pl.get('ref'),pl['id']) if k}
    keys|={'plan-'+k for k in keys}|{k.replace('plan-','') for k in keys}
    keys|={ALIAS[k] for k in keys if k in ALIAS}
    a,p=bool(keys&A),bool(keys&P)
    if a or p: out[pl['id']]='both' if a and p else 'aoki' if a else 'pegasis'
json.dump(out,open(os.path.join(ROOT,'src/data/picks.json'),'w'),indent=1)
print(len(out),'places with a pick')
