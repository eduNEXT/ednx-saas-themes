# ADR 1: Structure templates theme gefion

## Status:
Accepted

## Context
Tipically the override template on the openEdx platform is a copy of the original file and it is located on theme section. So its structure is similar with a few own adjustments and the content of the template is usually fixed.

## Decision
We will use the json configuration of the platform to fill the content of the templates and have dynamic content. Each section will have several elements that can be customized.

## Consequences
We have to develop each template according to the new customizable elements designed.
We will have the flexibility to change the content of the template without changin the template.