// @flow

type Props = {
  match: ?{
    params: ?Object,
  },
};

/**
 * Retrieve url params from props.
 */
export default function getParam(props: Props, key: string): ?any {
  const param =
    props &&
    props.match &&
    props.match.params &&
    props.match.params[key];

  return param || null;
}
