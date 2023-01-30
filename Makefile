########################################################################################################################
#
#
########################################################################################################################
.DEFAULT_GOAL := help
.PHONY: requirements

# include *.mk

# Generates a help message. Borrowed from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## Display this help message
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[\.a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

# TODO: define somewhere else
lang_targets = en ar da de_DE el es_419 fr he it_IT ja_JP ko_KR pt_BR pt_PT ru zh_CN zh_TW
create_translations_catalogs: ## Create the initial configuration of .mo files for translation
	pybabel extract -F  edx-platform/conf/locale/babel.cfg -o  edx-platform/conf/locale/django.pot --msgid-bugs-address=support@edunext.co --copyright-holder=eduNEXT edx-platform/*
	for lang in $(lang_targets) ; do \
        pybabel init -i edx-platform/conf/locale/django.pot -D django -d edx-platform/conf/locale/ -l $$lang ; \
    done

update_translations: ## update strings to be translated
	pybabel extract -F edx-platform/conf/locale/babel.cfg -o edx-platform/conf/locale/django.pot edx-platform/*
	pybabel update -N -D django -i edx-platform/conf/locale/django.pot -d edx-platform/conf/locale/
	rm edx-platform/conf/locale/django.pot

compile_translations: ## compile .mo files into .po files
	pybabel compile -f -D django -d edx-platform/conf/locale/
