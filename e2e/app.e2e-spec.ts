import { PaintPage } from './app.po';

describe('paint App', () => {
  let page: PaintPage;

  beforeEach(() => {
    page = new PaintPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
