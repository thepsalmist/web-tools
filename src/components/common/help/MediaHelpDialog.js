import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import SimpleDialog from '../../common/SimpleDialog';

const localMessages = {
  invitation: { id: 'help.media.invitation', defaultMessage: 'Learn about writing search terms.' },
  learnMoreTitle: { id: 'help.media.title', defaultMessage: 'Searching Media' },
  learnMoreDesc: { id: 'help.media.desc', defaultMessage: 'Media Cloud allows you to search within collections or media sources, or within online news sources directly. You can select media sources or collections in a variety of ways:' },
  learnMoreOption1: { id: 'help.media.option1', defaultMessage: 'Search within our geographic collections by country' },
  learnMoreOption2: { id: 'help.media.option2', defaultMessage: 'Pick from our commonly-used list of featured collections' },
  learnMoreOption3: { id: 'help.media.option3', defaultMessage: 'Pick from any sources or collections you have "starred"' },
  learnMoreOption4: { id: 'help.media.option4', defaultMessage: 'Search all our individual media sources by name or URL' },
  learnMoreInstructions: { id: 'help.media.instructions', defaultMessage: 'When you find a source or collection you want to add, click the + button to the right of the description. You can edit your selections (by clicking the X button to remove unwanted selections) in the lower left corner of the dialog window. Click the OK button to add your source selections to your query.' },

};

const MediaHelpDialog = (props) => {
  const { trigger, title } = props;
  const { formatMessage } = props.intl;
  return (
    <SimpleDialog
      trigger={trigger}
      title={title || formatMessage(localMessages.learnMoreTitle)}
    >
      <FormattedMessage {...localMessages.learnMoreDesc} />
      <ul>
        <li><FormattedMessage {...localMessages.learnMoreOption1} /></li>
        <li><FormattedMessage {...localMessages.learnMoreOption2} /></li>
        <li><FormattedMessage {...localMessages.learnMoreOption3} /></li>
        <li><FormattedMessage {...localMessages.learnMoreOption4} /></li>
      </ul>
      <FormattedMessage {...localMessages.learnMoreInstructions} />
    </SimpleDialog>
  );
};

MediaHelpDialog.propTypes = {
  intl: PropTypes.object.isRequired,
  trigger: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default
  injectIntl(
    MediaHelpDialog
  );
