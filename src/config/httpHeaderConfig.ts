import core, { NextFunction, Request, Response } from 'express'

export class HttpHeader {
  public static prepare(app: core.Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      this.setOrigin(res)
      this.setContent(res)
      this.setHeaders(req, res)
      next()
    })
  }

  private static setOrigin(res: Response) {
    res.header('Access-Control-Allow-Origin', '*')
    res.removeHeader('X-Powered-By')
  }

  private static setContent(res: Response) {
    res.header('Content-Type', 'application/json; charset=utf-8')
  }

  private static setHeaders(req: Request, res: Response) {
    const headers: string[] = [
      'Content-Type',
      'Authorization',
      'X-Refresh-Token'
    ]

    headers.forEach((headerName: string) => {
      const headerValue = req.get(headerName.toLowerCase())
      if (headerValue) {
        res.header(headerName, headerValue.toString())
      }
    })

    // Very important to fix bug that did login again after logout.
    if (!res.hasHeader('Cache-Control')) {
      // verify is there's a cache control parameter in header, if not, add it to not save when logout
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    }

    res.header('Access-Control-Allow-Headers', headers.join(','))
    res.header('Access-Control-Expose-Headers', headers.join(','))
  }
}
