import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import Story from './Components/Story';

export class PropsTable extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/boolean-prop-naming
    active: PropTypes.bool.isRequired,
    channel: PropTypes.shape({
      on: PropTypes.func,
      emit: PropTypes.func,
      removeListener: PropTypes.func
    }).isRequired,
    api: PropTypes.shape({
      on: PropTypes.func,
      off: PropTypes.func,
      getQueryParam: PropTypes.func,
      setQueryParams: PropTypes.func
    }).isRequired,
    legacy: PropTypes.string
  };

  static defaultProps = {
    legacy: false
  };

  state = { text: '' };

  componentDidMount() {
    const { channel, api } = this.props;
    // Listen to the PropsTable and render it.
    channel.on('storybook/PropsTable/add_PropsTable', this.onAddPropsTable);

    // Clear the current PropsTable on every story change.
    api.on(STORY_CHANGED, this.onAddPropsTable);
  }

  // This is some cleanup tasks when the PropsTable panel is unmounting.
  componentWillUnmount() {
    const { channel, api } = this.props;
    api.off(STORY_CHANGED, this.onAddPropsTable);

    this.unmounted = true;
    channel.removeListener(
      'storybook/PropsTable/add_PropsTable',
      this.onAddPropsTable
    );
  }

  onAddPropsTable = text => {
    this.setState({ text });
  };

  render() {
    const { active, legacy } = this.props;
    const { text } = this.state;

    if (legacy) {
      return legacy;
    }

    return active && text ? (
      <div
        style={{ padding: 10, boxSizing: 'border-box', width: '100%' }}
        className="addon-PropsTable-container"
      >
        <Story {...text} />
      </div>
    ) : null;
  }
}

addons.register('storybook/props', api => {
  const channel = addons.getChannel();

  addons.addPanel('storybook/props/panel', {
    title: 'Props',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => (
      <PropsTable
        key="storybook-addon-react-docgen"
        channel={channel}
        api={api}
        active={active}
      />
    )
  });
});
