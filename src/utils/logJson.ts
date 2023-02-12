import util from "util"

export default function logJson(object: object) {
  console.log(util.inspect(object, false, null, true /* enable colors */));
}
