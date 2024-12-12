# ednx-saas-themes

This repository contains the themes customized by Edunext for Openedx's [edx-platform](https://github.com/openedx/edx-platform).

## Table of Contents

- [ednx-saas-themes](#ednx-saas-themes)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Migration Process](#migration-process)
  - [Installation Steps](#installation-steps)
  - [Technical Details](#technical-details)
    - [Technologies Used](#technologies-used)
  - [Learn More](#learn-more)
  - [License](#license)

## Demo


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

1. Create a new branch based on master. The name of your branch should follow the structure <name_initials>/<description>, e,g. jd/beta-migration.

2. We have a document for the [migration tracking](https://docs.google.com/spreadsheets/d/1ly7rxyyHK-DvUS2hBpqylONlZC_MWqYkxPOV6dmPG1k/edit#gid=0). You should create a new page, duplicate the table, and fill the status and description columns with your findings and changes. The name of the page is the releases involved in the migration, e.g. Alpha to Beta.

3. The columns Bragi path and Open edX path help you to identify all the templates that you need to migrate and their current location. If you add a new template to Bragi you need to add a new row with those values. 

4. If during the migration you can not find a file in the Open edX path, you should update it with the new one.

5. Diff the changes between templates in Alpha (upstream) and Beta. You can use Diffchecker to compare them. This helps you as a filter to identify which templates you need to modify.

6. Diff the templates in Bragi Alpha with upstream Alpha from those with changes (step 3), this helps you to identify the Bragi customizations overwrite.

7. For the template Beta identified in step 3 add the Bragi customizations (step 4).

8. Verify the styles are correct if not make the corresponding changes.

9. Create a tenant to verify the custom variables are being applied.

10. Create a Pull Request to master with the migrated templates and styles updated.

11. Once the changes are approved and merged, create a branch for the new release, following the repository standard edunext/<release-name>.master, e.g. edunext/beta.master.

>[!TIP]
>You can follow steps 3 to 5 for each template so you can update the tracking documentation at the same time.

## Installation Steps


## Technical Details

### Technologies Used

- [Babel](https://babeljs.io/)
- [django](https://docs.djangoproject.com/en/5.1/ref/templates/language/)
- [Mako](https://www.makotemplates.org/)

## Learn More

* We no longer use `bragi-generator` and `bragi-childrens` (maintaining `css-runtime`) themes since Nutmeg.

## License

Copyright (c) eduNEXT.

All rights reserved.
