#!/usr/bin/env python3
"""Validate the formal ontology layer: gift.ttl parses, and example.ttl
conforms to the SHACL shapes. Exit non-zero on failure (for CI)."""
import sys
import rdflib
from pyshacl import validate

def parse(path, fmt="turtle"):
    g = rdflib.Graph(); g.parse(path, format=fmt)
    print(f"  ok  {path}: {len(g)} triples")
    return g

print("parsing ontology artifacts:")
parse("ontology/gift.ttl")
parse("ontology/gift.shacl.ttl")
data = parse("ontology/example.ttl")
parse("ontology/gift-context.jsonld", "json-ld")

print("SHACL conformance (example.ttl vs gift.shacl.ttl):")
conforms, _, text = validate(
    data_graph="ontology/example.ttl", shacl_graph="ontology/gift.shacl.ttl",
    data_graph_format="turtle", shacl_graph_format="turtle",
)
print("  conforms:", conforms)
if not conforms:
    print(text); sys.exit(1)
print("OK — ontology valid, example conforms.")
