# Formal ontology layer

`gift.ttl` is the machine-readable vocabulary — OWL 2 in Turtle. This is the artifact that makes `gift-onto` an ontology in the same sense as REA, PROV-O, or BFO, not only a library and a set of docs.

It is **aligned to W3C PROV-O**, which makes the central claim of [../docs/COMPARISON.md](../docs/COMPARISON.md) concrete:

- `gift:Person` ⊑ `prov:Agent`
- `gift:GiftAct` ⊑ `prov:Activity`
- `gift:hasGiver` ⊑ `prov:wasAssociatedWith`
- `gift:succeeds` ⊑ `prov:wasInformedBy`

gift extends provenance with exactly what provenance refuses: **weight** (value), **irreversibility**, and **asymmetry**.

## The five axioms, formalised

| Axiom | OWL encoding |
|---|---|
| 1. Irreversibility | `gift:GiftAct ⊑ (gift:irreversible value true)` |
| 2. Asymmetry of value | `gift:gave a owl:AsymmetricProperty, owl:IrreflexiveProperty`; `gift:weight` with datatype range 0.1–10.0 |
| 3. Personhood | `gift:GiftAct ⊑ (hasGiver exactly 1 Person) ⊓ (hasRecipient exactly 1 Person)` |
| 4. Non-conservation | `gift:Surplus` + `gift:produces` |
| 5. Freedom | acceptance is not modelled as a completion condition (no required counter-act) — see comment |

## What OWL deliberately does *not* hold

Kept honest in the file's trailing comment:

- `trust(A→B) = Σ(positive) − 3 × Σ(manipulations)` is a computed function over the act log → SPARQL / code, not OWL.
- The reduction theorem (*transaction = gift + counter-act + rollback*) is a meta-claim about ontologies → [COMPARISON.md](../docs/COMPARISON.md).
- Cross-act value constraints → a future SHACL shapes graph (`gift.shacl.ttl`).

## Validate it

```bash
pip install rdflib
python -c "import rdflib; g=rdflib.Graph(); g.parse('ontology/gift.ttl', format='turtle'); print(len(g), 'triples')"
# → 166 triples
```

Or load `gift.ttl` into Protégé to browse the class/property hierarchy and run a reasoner.
