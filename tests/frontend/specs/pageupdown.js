'use strict';

describe('Page Up & Page Down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nhello');
        cb();
      },
    });
  });

  // scrolls up 2 times
  it('scrolls up on key stroke', async function () {
    await helper.edit('Line 80', 80);
    await helper.waitForPromise(() => 81 === helper.caretLineNumber());
    // for some reason the page isn't inline with the edit
    helper.padOuter$('#outerdocbody').parent().scrollTop(1000);
    let intitialLineNumber = helper.caretLineNumber();
    helper.pageUp();
    await helper.waitForPromise(() => intitialLineNumber > helper.caretLineNumber());
    intitialLineNumber = helper.caretLineNumber();
    helper.pageUp();
    await helper.waitForPromise(() => intitialLineNumber > helper.caretLineNumber());
    await helper.waitForPromise(() => helper.padOuter$('#outerdocbody').parent().scrollTop() < 1000);
  });
  // scrolls down 3 times
  it('scrolls down on key stroke', async function () {
    // this places the caret in the first line
    await helper.edit('Line 1', 1);

    let currentLineNumber = helper.caretLineNumber();
    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());

    currentLineNumber = helper.caretLineNumber();
    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());

    currentLineNumber = helper.caretLineNumber();
    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
  });
});

describe('Page Up/Down Beginning and End position', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            '\n\n\n\nhello');
        cb();
      },
    });
  });

  it('scrolls to very end content on page down when viewport is at bottom of document', async function () {
    // this places the caret in the first line
    await helper.edit('Line 1', 1);

    const currentLineNumber = helper.caretLineNumber();
    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());

    // make sure caret is after hello
    const pos = helper.padInner$.document.getSelection();
    await helper.waitForPromise(() => pos.anchorOffset > 0);
  });

  // scrolls down 3 times - caret should be AFTER "hello
  it('scrolls to very beginning content on page up when viewport is at bottom of document', async function () {
    // this places the caret in the first line
    await helper.edit('Line 1', 1);

    const currentLineNumber = helper.caretLineNumber();
    helper.pageUp();
    await helper.waitForPromise(() => currentLineNumber > helper.caretLineNumber());

    // make sure caret is at 0 position
    const pos = helper.padInner$.document.getSelection();
    await helper.waitForPromise(() => pos.anchorOffset === 0);
  });
});

describe('Line number integrity is kept between page up/down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        cb();
      },
    });
  });

  const lineHistory = [];

  it('Page down three times to a given line, then page up and see if lines match', async function () {
    // this places the caret in the first line
    await helper.edit('Line 1', 1);

    const currentLineNumber = helper.caretLineNumber();
    lineHistory.push(helper.caretLineNumber());

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
    lineHistory.push(helper.caretLineNumber());

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
    lineHistory.push(helper.caretLineNumber());

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());

    let futureLineNumber = helper.caretLineNumber();
    helper.pageUp();
    await helper.waitForPromise(() => futureLineNumber > helper.caretLineNumber());
    if (helper.caretLineNumber() !== lineHistory[lineHistory.length - 1]) {
      throw new Error('Line History not being properly maintained on page up #1');
    }
    lineHistory.pop();

    futureLineNumber = helper.caretLineNumber();
    helper.pageUp();
    await helper.waitForPromise(() => futureLineNumber > helper.caretLineNumber());
    if (helper.caretLineNumber() !== lineHistory[lineHistory.length - 1]) {
      throw new Error('Line History not being properly maintained on page up #2');
    }
  });
});

describe('X character offset integrity is kept between page up/down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            'hel\n\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\n' +
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
            'hel\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\n' +
            'hello\n\n\nhello\n\n\nhel\n\n\nhel\n\nhel\n\nhel\n\nhel\n\nhel\n\nhel\n\nhel');
        cb();
      },
    });
  });

  it('Page down with an offset of 3 and check we keep our x offset', async function () {
    // Consider this document..
    //   hello*
    //   world
    //   .
    //   .
    //   .
    //   BOO!

    // Hitting page down at the star point should put your caret after BOO!
    // Now consider that the empty lines are very long and the caret lands in them.
    // We respect the original x character offset and try to pass it forward.

    // this places the caret in the first line
    await helper.edit('xxx', 1); // caret is offset 6

    let currentLineNumber = helper.caretLineNumber();
    const nodeLength = helper.padInner$.document.getSelection().anchorNode.length;

    const originalOffset = helper.padInner$.document.getSelection().anchorOffset;

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().anchorOffset === originalOffset ||
      !helper.padInner$.document.getSelection().anchorNode.length);
    // !helper.padInner$.document.getSelection().anchorNode.length) in the above line serves a useful purpose..
    // We use it to ensure character offset is respected on empty lines but also to check that it's continued
    // to be respected on next page downs.

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
    console.log(helper.padInner$.document.getSelection().anchorNode.length, 'WAT');
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().anchorOffset === originalOffset ||
      !helper.padInner$.document.getSelection().anchorNode.length);

    helper.pageDown();
    await helper.waitForPromise(() => currentLineNumber < helper.caretLineNumber());
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().anchorOffset === originalOffset ||
      !helper.padInner$.document.getSelection().anchorNode.length);

    // need to reset for page up
    currentLineNumber = helper.caretLineNumber();

    helper.pageUp();
    await helper.waitForPromise(() => currentLineNumber > helper.caretLineNumber());
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().anchorOffset === originalOffset ||
      !helper.padInner$.document.getSelection().anchorNode.length);
  });
});

describe('Really long text line goes to character within text line if text line is last line in viewport if the second line is also incredibly long', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world\n ' +
          'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
        'hello world hello world hello world hello world hello world hello world hello world ' +
            'hello world hello world hello world hello world hello world hello world hello world ' +
          'hello world hello world hello world hello world hello world hello world hello world\n\n\n\n\n\n\n\n\n ');
        cb();
      },
    });
  });

  it('Page down on really long line keeps character on the same line but with a large X offset', async function () {
    await helper.edit('xxx', 1); // caret is offset 6
    await helper.waitForPromise(() => {
      if ((helper.padInner$.document.getSelection().anchorOffset === 0) && (helper.caretLineNumber() === 1)) {
        return true;
      } else {
        helper.pageUp();
      }
    });
    helper.pageDown();
    await helper.waitForPromise(() => {
      if ((helper.padInner$.document.getSelection().anchorOffset > 0) && (helper.caretLineNumber() === 1)) {
        throw new Error('This test will pass but it should not..   We need logic to check we were at the last possible caret');
        return true;
      }
    });
    helper.pageUp();
    await helper.waitForPromise(() => {
      if ((helper.padInner$.document.getSelection().anchorOffset > 0) && (helper.caretLineNumber() === 1)) {
        throw new Error('This test will pass but it should not..   We need logic to check we were at the last possible caret accessible via the page up after the page down');
        return true;
      }
    });
  });
});

describe('Viewport based Page Up/Down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        cb();
      },
    });
  });
  it('page up when top is at 100 and caret is at bottom', async function () {
    // by default page down when caret is at end of the document will leave it in the same place.
    // viewport based pageup/down changes that
    const initialLineNumber = helper.caretLineNumber();
    helper.pageDown();
    helper.padOuter$('#outerdocbody').parent().scrollTop(100);
    helper.pageUp();
    await helper.waitForPromise(() => helper.caretLineNumber() < initialLineNumber);
  });

  it('page down when top is at 0 and caret is at bottom', async function () {
    // by default page down when caret is at end of the document will leave it in the same place.
    // viewport based pageup/down changes that
    const initialLineNumber = helper.caretLineNumber();
    helper.padOuter$('#outerdocbody').parent().scrollTop(0);
    await helper.waitForPromise(() => helper.padOuter$('#outerdocbody').parent().scrollTop() === 0);
    helper.pageUp(); // I think this might not be right..
    helper.pageDown();

    await helper.waitForPromise(() => (helper.caretLineNumber() < initialLineNumber) && (helper.caretLineNumber() > 1));
  });
});

describe('Shift Page Up/Down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        cb();
      },
    });
  });

  it('highlights lines on shift page down and releases them on page up', async function () {
    await helper.edit('xxx', 1); // caret is offset 6

    helper.pageUp();
    helper.pageDown({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Caret');
  });

  it('highlights lines on shift page down and maintains first selection on page up', async function () {
    await helper.edit('xxx', 1); // caret is offset 6

    helper.pageUp();
    helper.pageDown({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageDown({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');
  });


  it('highlights from end of document on page up then releases them on shift page down', async function () {
    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageDown({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Caret');
  });

  it('highlights from end of document on page up twice and retains on single page down', async function () {
    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageDown({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');
  });
  it('highlights from 3rd line on page up twice should keep highlight', async function () {
    await helper.edit('xxx', 3); // caret is offset 6

    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');

    helper.pageUp({
      shift: true,
    });
    await helper.waitForPromise(() => helper.padInner$.document.getSelection().type === 'Range');
  });
});

describe('Press and Hold Page Up/Down', function () {
  beforeEach(function (cb) {
    helper.newPad({
      cb: async () => {
        await helper.clearPad();
        // 200 lines
        await helper.edit(
            '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n' +
          '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        cb();
      },
    });
  });
  it('page up press and hold to top', async function () {
    // by default page down when caret is at end of the document will leave it in the same place.
    // viewport based pageup/down changes that
    const initialLineNumber = helper.caretLineNumber();
    helper.pageUp({
      pressAndHold: true,
    });
    await helper.waitForPromise(() => helper.caretLineNumber() === 1);
  });
  it('page down press and hold to bottom', async function () {
    // by default page down when caret is at end of the document will leave it in the same place.
    // viewport based pageup/down changes that
    const initialLineNumber = helper.caretLineNumber();
    helper.pageDown({
      pressAndHold: true,
    });
    await helper.waitForPromise(() => helper.caretLineNumber() === initialLineNumber);
  });
});