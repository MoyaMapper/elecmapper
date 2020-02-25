export const showType = {
  hidden: 0,
  half: 1,
  full: 2
}

export const SwiftType = {
  int: "Int",
  bool: "Bool",
  float: "Float",
  double: "Double",
  string: "String",
  array: "Array"
}

export const swiftTypeArr = [
  SwiftType.int, 
  SwiftType.bool, 
  SwiftType.float, 
  SwiftType.double, 
  SwiftType.string, 
  SwiftType.array
]

export const OperationType = {
  modifyTitle: 0,
  switchSwiftType: 1,
  delete: 2,
  modifyClassName: 3
}

export const SWITCH_SHOW_TYPE = "format/SWITCH_SHOW_TYPE";
export const NEW_JSON_DATA = "format/NEW_JSON_DATA";
export const UPDATE_JSON_DATA = "format/UPDATE_JSON_DATA";