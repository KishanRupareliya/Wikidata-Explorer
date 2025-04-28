import { browser, by, element } from 'protractor';

describe('Wikidata Explorer E2E Tests', () => {
  beforeEach(() => {
    browser.get('/');
  });

  /*it('should display title', () => {
    expect(element(by.css('h1')).getText()).toEqual('Wikidata Explorer');
  });*/

  it('should display title', async () => {  // Note async keyword
    expect(await element(by.css('h1')).getText()).toEqual('Wikidata Explorer');
  });

  it('should perform search and display results', () => {
    const searchInput = element(by.css('input[type="text"]'));
    const searchButton = element(by.css('button'));
    
    searchInput.sendKeys('chemnitz');
    searchButton.click();
    
    // Wait for results
    browser.wait(() => {
      return element.all(by.css('.search-results li')).count().then(count => count > 0);
    }, 5000);
    
    expect(element.all(by.css('.search-results li')).count()).toBeGreaterThan(0);
  });

  it('should show entity details when result is clicked', () => {
    const searchInput = element(by.css('input[type="text"]'));
    const searchButton = element(by.css('button'));
    
    searchInput.sendKeys('chemnitz');
    searchButton.click();
    
    // Wait for results and click first one
    browser.wait(() => {
      return element.all(by.css('.search-results li')).count().then(count => count > 0);
    }, 5000);
    
    element.all(by.css('.search-results li button')).first().click();
    
    // Check if entity view is displayed
    expect(element(by.css('app-entity-view h2')).isPresent()).toBeTruthy();
  });
});