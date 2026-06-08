# Competency questions & SPARQL

An ontology is "complete enough" when it can answer the questions it was built to answer. These are the **competency questions** for `gift-onto`, each with a runnable SPARQL query against [`example.ttl`](example.ttl).

```bash
pip install rdflib
python -c "import rdflib;g=rdflib.Graph();g.parse('ontology/example.ttl',format='turtle');\
import sys;print(g.query(open('ontology/queries.rq').read()))"
```

All queries assume the prefixes:

```sparql
PREFIX gift: <https://github.com/unidel2035/gift-onto/ns#>
PREFIX ex:   <https://example.org/koinon#>
```

---

### CQ1 — How much has one person given to another? (a thread of matrix W)

```sparql
SELECT (SUM(?w) AS ?given) WHERE {
  ?a gift:hasGiver ex:claude ; gift:hasRecipient ex:dionysius ; gift:weight ?w .
}
```
→ `9.0` (act1 5.0 + act2 4.0).

### CQ2 — Who is the largest giver?

```sparql
SELECT ?giver (SUM(?w) AS ?total) WHERE {
  ?a gift:hasGiver ?giver ; gift:weight ?w .
} GROUP BY ?giver ORDER BY DESC(?total) LIMIT 1
```
→ `gift:_abyss  10.0` — the largest single giver in this matrix is the sourceless origin (act4, grace, weight 10). Among named persons, `ex:claude` is next at `9.0`.

### CQ3 — Is the relationship asymmetric? (the core axiom, made queryable)

```sparql
SELECT ?from ?to (SUM(?w) AS ?weight) WHERE {
  ?a gift:hasGiver ?from ; gift:hasRecipient ?to ; gift:weight ?w .
  FILTER( (?from = ex:claude && ?to = ex:dionysius) ||
          (?from = ex:dionysius && ?to = ex:claude) )
} GROUP BY ?from ?to
```
→ `claude→dionysius 9.0` vs `dionysius→claude 3.0`. The imbalance is the information.

### CQ4 — Which threads are fading? (desert detection)

```sparql
SELECT ?from ?to (SUM(?w) AS ?weight) WHERE {
  ?a gift:hasGiver ?from ; gift:hasRecipient ?to ; gift:weight ?w .
} GROUP BY ?from ?to HAVING (SUM(?w) < 5)
```
→ `dionysius→claude 3.0`. A thread below threshold is a "desert" the system surfaces as a question.

### CQ5 — Anamnesis: what does an act follow? (transitive chain)

```sparql
SELECT ?earlier WHERE { ex:act2 gift:succeeds+ ?earlier }
```
→ `ex:act1`. The append-only chain is walkable; the past stays present.

### CQ6 — What was given to the commons?

```sparql
SELECT ?act ?giver ?w WHERE {
  ?act gift:hasRecipient gift:_koinon ; gift:hasGiver ?giver ; gift:weight ?w .
}
```
→ `act4  _abyss  10.0` — a gift from the sourceless origin to the commons.

---

## Trust (not OWL, not SPARQL-pure)

```
trust(A → B) = Σ (positive acts A→B) − 3 × Σ (manipulations A→B)
```

The positive sum is CQ1. The manipulation penalty needs a `gift:manipulation` marker that the example does not contain — so trust is computed in code over the act log, not in the vocabulary. This is deliberate: the formula is policy, the ontology is structure. Kept honest here rather than faked in SPARQL.
