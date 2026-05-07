# 2. Pack-Driven Content

## Status

Accepted

## Context

The prompt asks for future expansion into UNIX commands, API methods, and other syntax domains.

## Decision

Represent syntax content as packs with metadata, theme tokens, and ordered levels. The game loop consumes the same shape for every pack.

## Consequences

New content can be added with low code churn. Pack validation is important so broken prompts do not reach players.
