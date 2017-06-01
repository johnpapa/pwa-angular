import { PwaAngularPage } from './app.po';

describe('pwa-angular App', () => {
  let page: PwaAngularPage;

  beforeEach(() => {
    page = new PwaAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pwa works!');
  });
});
