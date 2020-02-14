import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import PageHeader from '../../containers/pageHeader';
import Loading from '../../containers/loading';
import ScreenNotification from '../../containers/screenNotification';

class PageLayout extends React.Component {

  render() {
    const { title } = this.props;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Loading/>
        <ScreenNotification/>
        <PageHeader title={title}/>
        {this.props.children}
      </div>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default PageLayout;
