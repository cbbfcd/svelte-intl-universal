import invariant from 'invariant';
import merge from 'lodash.merge';
import get from 'lodash.get';
import foreach from 'lodash.foreach';
import escape from 'escape-html';
import IntlMessageFormat, { Formats, Options } from 'intl-messageformat';

type IObject = { [key: string]: any };

export interface IOptions {
  currentLocale: string;
  fallbackLocale?: string;
  escapeHtml?: boolean;
  locales: IObject;
  // intl-messageformat parameter. more detail in https://formatjs.io/docs/intl-messageformat
  formats?: Formats;
  options?: Options;
}

export default class SvelteIntlUniversal {
  private readonly options: IOptions;

  constructor() {
    this.options = {
      currentLocale: '',
      escapeHtml: true,
      locales: {},
    };
  }

  public get(key: string, variables?: IObject | string, fallback: string = '') {
    invariant(key, '[svelte-intl-universal] key is required.');

    if (arguments.length === 2 && typeof variables === 'string') {
      fallback = variables;
      variables = void 0;
    }

    const {
      locales = {},
      currentLocale = '',
      fallbackLocale = '',
      escapeHtml,
      formats,
      options,
    } = this.options;

    if (!fallbackLocale && !locales[currentLocale]) {
      return fallback;
    }

    let msg: string = get(locales[currentLocale], key) ?? get(locales[fallbackLocale], key);
    if (msg == null) {
      return fallback;
    }

    if (variables && escapeHtml) {
      variables = Object.assign({}, variables ?? {});
      // todo any
      foreach(variables as IObject, (val: any, key: string) => {
        if (
          typeof val === 'string' &&
          val.indexOf('>') >= 0 &&
          val.indexOf('<') >= 0
        ) {
          val = escape(val);
          (variables as IObject)[key] = val;
        }
      });
    }

    try {
      const formatter = new IntlMessageFormat(
        msg,
        currentLocale,
        formats,
        options
      );
      return formatter.format(variables as IObject);
    } catch (error) {
      return msg ?? fallback;
    }
  }

  public init = (opts: Partial<IOptions> = {}) => {
    invariant(
      opts.currentLocale,
      '[svelte-intl-universal] options.currentLocale is required.'
    );
    invariant(
      opts.locales,
      '[svelte-intl-universal] options.locales is required.'
    );

    Object.assign(this.options, opts);
  };

  public load = (locales: IObject = {}) => {
    merge(this.options.locales, locales);
  };
}
