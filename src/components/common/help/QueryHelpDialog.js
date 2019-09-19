import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import SimpleDialog from '../SimpleDialog';

const localMessages = {
  invitation: { id: 'help.query.invitation', defaultMessage: 'Learn about writing search terms.' },
  title: { id: 'help.query.title', defaultMessage: 'Writing Media Cloud Queries' },
  content: { id: 'help.query.content', defaultMessage: `
<p>You can query Media Cloud with boolean searches that match stories, a lot like you might use Google.  Here are some examples:</p>
<ul><li>Boolean Connectors</li>
<ul><li><code>OR</code></li>
<ul><li> - cheese OR cheesy - using "OR" searches for stories that use either "cheese" or the word "cheesy," or stories that contain both words</li>
<li> - Note: OR is the default connector. This means that unless you specifically put quotations around words or add an "AND" or "NOT" between them, the system will treat your search as though there is an OR.</li>
</ul></ul>
<ul><li><code>AND</code></li>
<ul><li> - cheese AND blue - using "AND" lets you look for stories that include both the word "cheese" and the word "blue"</li>
</ul></ul>
<ul><li><code>NOT</code></li>
<ul><li> - cheese NOT blue - using "NOT" lets you remove content you don't want; searching for stories that use the word "cheese" but don't have the word "blue" in them</li>
</ul></ul></ul>
<ul><li>Other Search Parameters</li>
<ul><li><code>ASTERIX</code></li>
<ul><li><code>chees*</code> - using an asterix searches for stories that use any word that starts with "chees" - including "cheese", "cheesy", or others</li>
</ul></ul>
<ul><li><code>QUOTATIONS</code></li>
<ul><li> - "blue cheese" - putting a phrase in quotes lets you search for stories that use the exact phrase "blue cheese"</li>
<li> - Please note that we do not support searching for different forms of a word (using an asterisk) inside of quotation marks</li>
</ul></ul>
<ul><li><code>SEARCHING IN ANOTHER LANGUAGE</code></li>
<ul><li> - fromage AND language:fr - using the "language:" keyword lets you narrow in on a language; here searching for stories that use the word "fromage" and have been detected by our system as being written in French</li>
<li> - Visit our <a href="https://mediacloud.org/support/languages">language</a> guide to learn more about the language we support and their codes</li>
</ul></ul>
<ul><li><code>PARENTHESES</code></li>
<ul><li> - cheese AND (blue OR manchego OR goat OR cheddar) - using parentheses lets you author more complex queries; searching here for stories that have the word "cheese" and at least one other word describing what type it is</li>
</ul></ul>
<ul><li><code>PROXIMITY SEARCH</code></li>
<ul><li> - "cheese blue" ~10 - enter your keywords in quotation marks and then include a tilde ~, followed by the number of words you want to limit your search to in terms of proximity. This will return stories in which cheese and blue are within 10 words of each other.</li>
<li> - Please note that we do not support searching for different forms of a word (using an asterisk) in proximity search</li>
</ul></ul></ul>
<p><a href="https://mediacloud.org/support/query-guide" target=_blank>Read our guide to creating queries to learn more</a>.</p>
  ` },
};

const QueryHelpDialog = (props) => {
  const { trigger } = props;
  const { formatMessage } = props.intl;

  return (
    <SimpleDialog
      trigger={trigger}
      title={formatMessage(localMessages.title)}
    >
      <div className="query-help-dialog-content">
        <FormattedHTMLMessage {...localMessages.content} />
      </div>
    </SimpleDialog>
  );
};

QueryHelpDialog.propTypes = {
  intl: PropTypes.object.isRequired,
  trigger: PropTypes.string.isRequired,
};

export default
injectIntl(
  QueryHelpDialog
);
