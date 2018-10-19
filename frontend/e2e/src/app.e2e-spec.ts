'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Topics';
const expectedTitle = `${expectedH1}`;
const targetTopic = { id: 15, name: 'Magneta' };
const targetTopicDashboardIndex = 3;
const nameSuffix = 'X';
const newTopicName = targetTopic.name + nameSuffix;

class Topic {
  id: number;
  name: string;

  // Factory methods

  // Topic from string formatted as '<id> <name>'.
  static fromString(s: string): Topic {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Topic from topic list <li> element.
  static async fromLi(li: ElementFinder): Promise<Topic> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Topic id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Topic> {
    // Get topic id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topTopics: element.all(by.css('app-root app-dashboard > div h4')),

      appTopicsHref: navElts.get(1),
      appTopics: element(by.css('app-root app-topics')),
      allTopics: element.all(by.css('app-root app-topics li')),
      selectedTopicSubview: element(by.css('app-root app-topics > div:last-child')),

      topicDetail: element(by.css('app-root app-topic-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Topics'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top topics', () => {
      let page = getPageElts();
      expect(page.topTopics.count()).toEqual(4);
    });

    it(`selects and routes to ${targetTopic.name} details`, dashboardSelectTargetTopic);

    it(`updates topic name (${newTopicName}) in details view`, updateTopicNameInDetailView);

    it(`cancels and shows ${targetTopic.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetTopicElt = getPageElts().topTopics.get(targetTopicDashboardIndex);
      expect(targetTopicElt.getText()).toEqual(targetTopic.name);
    });

    it(`selects and routes to ${targetTopic.name} details`, dashboardSelectTargetTopic);

    it(`updates topic name (${newTopicName}) in details view`, updateTopicNameInDetailView);

    it(`saves and shows ${newTopicName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetTopicElt = getPageElts().topTopics.get(targetTopicDashboardIndex);
      expect(targetTopicElt.getText()).toEqual(newTopicName);
    });

  });

  describe('Topics tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Topics view', () => {
      getPageElts().appTopicsHref.click();
      let page = getPageElts();
      expect(page.appTopics.isPresent()).toBeTruthy();
      expect(page.allTopics.count()).toEqual(10, 'number of topics');
    });

    it('can route to topic details', async () => {
      getTopicLiEltById(targetTopic.id).click();

      let page = getPageElts();
      expect(page.topicDetail.isPresent()).toBeTruthy('shows topic detail');
      let topic = await Topic.fromDetail(page.topicDetail);
      expect(topic.id).toEqual(targetTopic.id);
      expect(topic.name).toEqual(targetTopic.name.toUpperCase());
    });

    it(`updates topic name (${newTopicName}) in details view`, updateTopicNameInDetailView);

    it(`shows ${newTopicName} in Topics list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetTopic.id} ${newTopicName}`;
      expect(getTopicAEltById(targetTopic.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newTopicName} from Topics list`, async () => {
      const topicsBefore = await toTopicArray(getPageElts().allTopics);
      const li = getTopicLiEltById(targetTopic.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appTopics.isPresent()).toBeTruthy();
      expect(page.allTopics.count()).toEqual(9, 'number of topics');
      const topicsAfter = await toTopicArray(page.allTopics);
      // console.log(await Topic.fromLi(page.allTopics[0]));
      const expectedTopics =  topicsBefore.filter(h => h.name !== newTopicName);
      expect(topicsAfter).toEqual(expectedTopics);
      // expect(page.selectedTopicSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetTopic.name}`, async () => {
      const newTopicName = 'Alice';
      const topicsBefore = await toTopicArray(getPageElts().allTopics);
      const numTopics = topicsBefore.length;

      element(by.css('input')).sendKeys(newTopicName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let topicsAfter = await toTopicArray(page.allTopics);
      expect(topicsAfter.length).toEqual(numTopics + 1, 'number of topics');

      expect(topicsAfter.slice(0, numTopics)).toEqual(topicsBefore, 'Old topics are still there');

      const maxId = topicsBefore[topicsBefore.length - 1].id;
      expect(topicsAfter[numTopics]).toEqual({id: maxId + 1, name: newTopicName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in topics.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive topic search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetTopic.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let topic = page.searchResults.get(0);
      expect(topic.getText()).toEqual(targetTopic.name);
    });

    it(`navigates to ${targetTopic.name} details view`, async () => {
      let topic = getPageElts().searchResults.get(0);
      expect(topic.getText()).toEqual(targetTopic.name);
      topic.click();

      let page = getPageElts();
      expect(page.topicDetail.isPresent()).toBeTruthy('shows topic detail');
      let topic2 = await Topic.fromDetail(page.topicDetail);
      expect(topic2.id).toEqual(targetTopic.id);
      expect(topic2.name).toEqual(targetTopic.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetTopic() {
    let targetTopicElt = getPageElts().topTopics.get(targetTopicDashboardIndex);
    expect(targetTopicElt.getText()).toEqual(targetTopic.name);
    targetTopicElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.topicDetail.isPresent()).toBeTruthy('shows topic detail');
    let topic = await Topic.fromDetail(page.topicDetail);
    expect(topic.id).toEqual(targetTopic.id);
    expect(topic.name).toEqual(targetTopic.name.toUpperCase());
  }

  async function updateTopicNameInDetailView() {
    // Assumes that the current view is the topic details view.
    addToTopicName(nameSuffix);

    let page = getPageElts();
    let topic = await Topic.fromDetail(page.topicDetail);
    expect(topic.id).toEqual(targetTopic.id);
    expect(topic.name).toEqual(newTopicName.toUpperCase());
  }

});

function addToTopicName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getTopicAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getTopicLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toTopicArray(allTopics: ElementArrayFinder): Promise<Topic[]> {
  let promisedTopics = await allTopics.map(Topic.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedTopics);
}
