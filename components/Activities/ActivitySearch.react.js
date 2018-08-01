import moment from 'moment-timezone';
import React from 'react';
import {AsyncTypeahead, Highlighter, Menu, MenuItem} from 'react-bootstrap-typeahead';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Distance from '../Distance/Distance.react';
import Middot from '../Middot.react';

import {makeRequest} from '../../actions';
import secondsToTime from '../../utils/secondsToTime';
import ActionTypes from '../../constants/ActionTypes';

import './css/ActivitySearch.scss';

class ActivitySearch extends React.Component {
  state = {
    value: '',
  };

  render() {
    const {history, onSearch, pendingRequests, searchResults} = this.props;

    const isLoading =
      !!(pendingRequests && pendingRequests[ActionTypes.ACTIVITIES_SEARCH]);

    return (
      <AsyncTypeahead
        bsSize="small"
        className="app-form activity-search"
        filterBy={(option, {text}) => (
          // Custom filterBy function to bypass use of labelKey.
          option.notes.toLowerCase().indexOf(text.toLowerCase()) > -1
        )}
        isLoading={isLoading}
        labelKey={() => (
          // HACK: Return the input text to suppress hinting and displaying
          // the labelKey in the input.
          this.state.value
        )}
        maxResults={25}
        menuId="activity-search"
        onChange={(selected) => {
          history.push(`/activities/${selected[0].id}`);
        }}
        onInputChange={(value) => this.setState({value})}
        onSearch={onSearch}
        options={searchResults}
        paginate={false}
        placeholder="Search activities..."
        renderMenu={(results, props) => (
          <Menu {...props}>
            {results.map((r, idx) => (
              <MenuItem
                className="activity-search-item"
                key={r.id}
                option={r}
                position={idx}>
                <Highlighter search={props.text}>
                  {r.notes}
                </Highlighter>
                <div className="activity-search-metadata">
                  <span>
                    {moment
                      .tz(r.startDate, r.timezone)
                      .format('ddd, MMMM Do, YYYY')
                    }
                  </span>
                  <Middot />
                  <Distance distance={r.distance} />
                  <Middot />
                  <span>
                    {secondsToTime(r.duration)}
                  </span>
                </div>
              </MenuItem>
            ))}
          </Menu>
        )}
      />
    );
  }
}

const mapStateToProps = ({pendingRequests, searchResults}) => ({
  pendingRequests,
  searchResults,
});

const mapDispatchToProps = (dispatch) => ({
  onSearch: (filter) => dispatch(makeRequest(`
    query activities($filter: String) {
      activities(filter: $filter) {
        nodes {
          id,
          distance,
          duration,
          notes,
          startDate,
          timezone,
        },
      },
    }
  `, {filter}, ActionTypes.ACTIVITIES_SEARCH)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ActivitySearch));
