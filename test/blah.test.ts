import intl from '../src'
import zhCN from "./locales/zh-CN"
import enUS from "./locales/en-US"
import enUSMore from './locales/en-US-more'

const locales = {
  "en-US": enUS,
  "zh-CN": zhCN,
}

describe('blah...', () => {
  it('Set specific locale', () => {
    intl.init({ locales, currentLocale: "zh-CN" })
    expect(intl.get("SIMPLE")).toBe("简单")
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("SIMPLE")).toBe("Simple")
  })

  it('Message with variables', () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("HELLO", { name: "Tony" })).toBe("Hello, Tony")
  })

  it("Message with brace", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("BRACE1")).toBe("The format is {var}")
    expect(intl.get("BRACE2")).toBe("The format is ${var}")
  })

  it("Set specific locale with nested notation", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("NESTED.HELLO")).toBe("Hello World")
    expect(intl.get("NESTED.HELLO_NAME", { name: "World" })).toBe("Hello, World")
  })

  it("Message with Date", () => {
    let start = new Date("Fri Apr 07 2017 17:08:33")
    intl.init({ locales, currentLocale: "en-US" })
    expect(
      intl.get("SALE_START", {
        start: start
      })
    ).toBe("Sale begins 4/7/2017")
    expect(
      intl.get("SALE_END", {
        start: start
      })
    ).toBe("Sale begins April 7, 2017")
  })

  it("Message with Time", () => {
    let expires = new Date("Fri Apr 07 2017 17:08:33")
    intl.init({ locales, currentLocale: "en-US" })
    expect(
      intl.get("COUPON", {
        expires: expires
      })
    ).toBe("Coupon expires at 5:08:33 PM");
    intl.init({ locales, currentLocale: "zh-CN" })
    expect(
      intl.get("COUPON", {
        expires: expires
      })
    ).toBe("优惠卷将在17:08:33过期")
  })

  it("Message with Currency", () => {
    let price = 123456.78
    intl.init({ locales, currentLocale: "en-US" })
    expect(
      intl.get("SALE_PRICE", {
        price: price
      })
    ).toBe("The price is $123,456.78")
    intl.init({ locales, currentLocale: "zh-CN" })
    expect(
      intl.get("SALE_PRICE", {
        price: price
      })
    ).toBe("售价CN¥ 123,456.78")
  })

  test("Message with plural", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(
      intl.get("PHOTO", {
        num: 0
      })
    ).toBe("You have no photos.")
    expect(
      intl.get("PHOTO", {
        num: 1
      })
    ).toBe("You have one photo.")
    expect(
      intl.get("PHOTO", {
        num: 10
      })
    ).toBe("You have 10 photos.")

    intl.init({ locales, currentLocale: "zh-CN" })
    expect(
      intl.get("PHOTO", {
        num: 1
      })
    ).toBe("你有1张照片")
  })

  test("Message with skeleton", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(
      intl.get("SKELETON_VAR", {
        value: 42.5
      })
    ).toBe("Increase by 42.5")

    expect(
      intl.get("SKELETON_VAR", {
        value: 42
      })
    ).toBe("Increase by 42.0")

    expect(
      intl.get("SKELETON_VAR", {
        value: 42.109
      })
    ).toBe("Increase by 42.11")

    expect(
      intl.get("SKELETON_SELECTORDINAL", {
        year: 2
      })
    ).toBe("It's my cat's 2nd birthday!")

    expect(
      intl.get("SKELETON_SELECTORDINAL", {
        year: 10
      })
    ).toBe("It's my cat's 10th birthday!")
  })

  test("Without default message, just return empty string", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("not-exist-key")).toBe("")
  })

  test("Default message", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("not-exist-key", 'this is default msg')).toBe(
      "this is default msg"
    )

    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("HELLO.NO_EXIST_KEY", { name: "Tony" }, 'no the person')).toBe("no the person")
  })

  test("Default message with nested key", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("NOT_EXIST_KEY.HELLO", 'this is default msg')).toBe("this is default msg")
  })

  test("Get dot key variables", () => {
    intl.init({ locales, currentLocale: "en-US" })
    expect(intl.get("DOT.HELLO")).toBe("Hello World")
  })

  test("load mutiple locale data without overriding existing one", () => {
    intl.init({ locales, currentLocale: "en-US" })
    const localesMore = {
      "en-US": enUSMore,
    };
    intl.load(localesMore);
    expect(intl.get("SIMPLE")).toBe("Simple")
    expect(intl.get("MORE")).toBe("More data")
  })

  test("Uses fallback locale if key not found in currentLocale", () => {
    intl.init({ locales, currentLocale: "zh-CN", fallbackLocale: "en-US" })
    expect(intl.get("ONLY_IN_ENGLISH")).toBe("ONLY_IN_ENGLISH")
  })

  test("Uses default message if key not found in fallbackLocale", () => {
    intl.init({ locales, currentLocale: "zh-CN", fallbackLocale: "en-US" })
    expect(intl.get("not-exist-key", 'this is default msg')).toBe("this is default msg")
  })
})
