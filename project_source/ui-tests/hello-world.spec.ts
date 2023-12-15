import { expect } from "chai";
import { device, odc, utils, ecp } from "roku-test-automation";

describe("hello world", () => {
  it("press a button and increment a counter", async () => {
    // Load configuration
    utils.setupEnvironmentFromConfigFile("./ui-tests/rta-config.json");

    // Deploy application
    await device.deploy({ files: ["**/*"], rootDir: "dist" });

    // Wait for application load
    await odc.onFieldChangeOnce({
      keyPath: ".appLaunchComplete",
      match: true,
    });

    // assert correct text from the title label
    let titleText = await odc.getValue({ keyPath: "#title.text" });
    expect(titleText.value).to.eql("Welcome to the button app");

    // assert correct press count
    let messageText = await odc.getValue({ keyPath: "#message.text" });
    const regexp = /([0-9]+) time/;
    let match = messageText.value.match(regexp);
    expect(`${match[1]}`).to.eql('0');

    // Check that the button is focused
    expect(await odc.isInFocusChain({ keyPath: "#button" })).to.be.true;

    // Press the button
    await ecp.sendKeypress(ecp.Key.Ok);

    // assert button press count was incremented
    messageText = await odc.getValue({ keyPath: "#message.text" });
    match = messageText.value.match(regexp);
    expect(`${match[1]}`).to.eql('1');

    // End the in-app task that enables the `getValue()` method.
    await odc.shutdown;
  });
});
