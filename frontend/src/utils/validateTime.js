export default function validateTime(time) {
  return (
    time?.length !== 5 || RegExp(/^([0-1][0-9]|2[0-3]):([0-5][0-9])/).test(time)
  );
}
