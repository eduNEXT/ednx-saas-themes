# ednx-saas-themes

This repository contains the themes customized by Edunext for Openedx's [edx-platform](https://github.com/openedx/edx-platform).

## Table of Contents

  - [Installation Steps](#installation-steps)
  - [Migration Process](#migration-process)
  - [Technical Details](#technical-details)
    - [Technologies Used](#technologies-used)
  - [Learn More](#learn-more)
  - [License](#license)

## Installation Steps

Bragi works with [eox-theming](https://github.com/eduNEXT/eox-theming), you need to install the Django plugin to enable the theme.

The easiest way to install Bragi in your instance is using [tutor-contrib-picasso](https://github.com/eduNEXT/tutor-contrib-picasso?tab=readme-ov-file#enable-themes) as follows:

```yml
PICASSO_THEMES:
- name: ednx-saas-themes
  repo: git@github.com:eduNEXT/ednx-saas-themes.git
  version: edunext/redwood.master
PICASSO_THEMES_NAME:
- bragi
- css-runtime
PICASSO_THEME_DIRS:
- /openedx/themes/ednx-saas-themes/edx-platform
- /openedx/themes/ednx-test-themes/edx-platform/bragi-children

```

If you want to use ``css-runtime`` you need to add the following configuration to the instance or tenant config:

```json
{
     "THEME_OPTIONS": {
        "theme": {
            "name": "css-runtime",
            "parent": "bragi"
        }
    },
}
```

Otherwise, to add the Bragi theme in a instance follow these steps:

1. Be sure you have eox-tenant and eox-theming in your environment.
2. Clone the repo in ``env/build/openedx/themes`` and use the branch to work with.
3. Add this line in ``env/build/openedx/settings/lms/assets.py`` and ``env/build/openedx/settings/cms/assets.py``

```py
COMPREHENSIVE_THEME_DIRS.extend(['/openedx/themes/ednx-saas-themes/edx-platform', '/openedx/themes/ednx-saas-themes/edx-platform/bragi-children'])
```


In the ``lms.env.yml`` and ``cms.env.yml`` be sure to add:

```py
USE_EOX_TENANT: True
DEFAULT_SITE_THEME: "bragi"
COMPREHENSIVE_THEME_DIRS: ['/openedx/themes/ednx-saas-themes/edx-platform', '/openedx/themes/ednx-saas-themes/edx-platform/bragi-children']
```
4. Open bash and compile bragi theme, context
``` bash
source .tvm/bin/activate
tutor dev run lms bash
# Inside the lms bash 
npm run compile-sass -- --theme-dir /openedx/themes/ednx-saas-themes/edx-platform --theme-dir /openedx/themes/ednx-saas-themes/edx-platform/bragi-children  --theme bragi --theme css-runtime
```
## Migration Process

Open edX releases a new version of the platform every 6 months, in that process the templates or styles could be updated, our task here is to make those updates in Bragi if applicable.

Let's review different scenarios and the action to take in each one:

| Scenario | Action |
|----------|--------|
| There is an update in the style and does not compromise the look and feel of Bragi. | N/A. |
| There is a change in the style and Bragi does not look as before in some parts of the website. | Update the styles to match the default look and feel. |
| A template is updated in areas that Bragi overwrite | N/A |
| A template is updated and Bragi does not apply custom changes over that area. | Copy the changes in the Bragi template to update it. |

Imagine the current version of Bragi is Alpha and we need to migrate to Beta. The step by step is:

1. Create a new branch based on master. The name of your branch should follow the structure ``<name_initials>/<description>``, e,g. ``jd/beta-migration``.

2. We have a document for the [migration tracking](https://docs.google.com/spreadsheets/d/1ly7rxyyHK-DvUS2hBpqylONlZC_MWqYkxPOV6dmPG1k/edit#gid=0). You should create a new page, duplicate the table, and fill the status and description columns with your findings and changes. The name of the page is the releases involved in the migration, e.g. Alpha to Beta.

3. The columns Bragi path and Open edX path help you to identify all the templates that you need to migrate and their current location. If you add a new template to Bragi you need to add a new row with those values. 

4. If during the migration you can not find a file in the Open edX path, you should update it with the new one.

5. Diff the changes between templates in Alpha (upstream) and Beta. You can use [Diffchecker](https://www.diffchecker.com/text-compare/#editor) to compare them. This helps you as a filter to identify which templates you need to modify.

6. Diff the templates in Bragi Alpha with upstream Alpha from those with changes (step 5), this helps you to identify the Bragi customizations overwritten.

7. For the template Beta identified in step 5 add the Bragi customizations (step 6).

8. Verify the styles are correct, if not, make the corresponding changes.

9. Create a tenant to verify the custom variables are being applied.

10. Create a Pull Request to master with the migrated templates and styles updated.

11. Once the changes are approved and merged, create a branch for the new release, following the repository standard ``edunext/<release-name>.master``, e.g. ``edunext/beta.master``.

>[!TIP]
>You can follow steps 3 to 6 for each template so you can update the tracking documentation at the same time.

For a detailed explanation of Bragi, the migration process, and how it works with eox-theming, please review the following video: [Onboarding Bragi](https://www.youtube.com/watch?v=A9bEQm4zUWI)


## Technical Details

### Technologies Used

- [Babel](https://babeljs.io/)
- [django](https://docs.djangoproject.com/en/5.1/ref/templates/language/)
- [Mako](https://www.makotemplates.org/)

## Technical Notes

* We no longer use `bragi-generator` and `bragi-childrens` themes since Nutmeg. With the introduction of CSS Variables in the Open edX ecosystem we are currently maintaining `css-runtime` and `bragi` themes.

## License

Copyright (c) eduNEXT.

All rights reserved.
