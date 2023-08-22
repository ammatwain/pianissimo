export default function(_options: any): any {
    const defaultOptions: any = {
      method: "GET",
      url: "",
      async: true,
      success: Function(null),
      failed: Function(null),
      data: {},
      "Content-Type": "application/json; charset=utf-8",
    };
    const options: any = Object.assign(defaultOptions, _options);
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const postData: any = Object.entries(options.data)
      .reduce((acc, [key, value]) => {
        acc.push(`${key}=${value}`);
        return acc;
      }, [])
      .join("&");

    if (options.method.toUpperCase() === "POST") {
      xhr.open(options.method, options.url, options.async);
      xhr.setRequestHeader("Content-Type", options["Content-Type"]);
      xhr.send(postData);
    } else if (options.method.toUpperCase() === "GET") {
      let {url} = options;
      if (postData) {
        if (url.indexOf("?") !== -1) {
          url += `&${postData}`;
        } else {
          url += `&${postData}`;
        }
      }
      xhr.open(options.method, url, options.async);
      xhr.setRequestHeader("Content-Type", options["Content-Type"]);
      xhr.send(null);
    }
    xhr.onreadystatechange = function(): void {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let res: string = xhr.responseText;
        if (options["Content-Type"] === defaultOptions["Content-Type"]) {
          res = JSON.parse(res);
        }
        if (options.success) {
          options.success(res);
        }
      } else {
        if (options.failed) {
          options.failed(xhr.status);
        }
      }
    };
  }
