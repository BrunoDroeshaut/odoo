/** @odoo-module alias=@mail/../tests/discuss/core/web/crosstab_tests default=false */
const test = QUnit.test; // QUnit.test()

import { startServer } from "@bus/../tests/helpers/mock_python_environment";

import { openDiscuss, start } from "@mail/../tests/helpers/test_utils";

import { patchWithCleanup } from "@web/../tests/helpers/utils";
import { assertSteps, click, contains, insertText, step } from "@web/../tests/utils";

QUnit.module("crosstab");

test("Channel subscription is renewed when channel is manually added", async () => {
    const pyEnv = await startServer();
    pyEnv["discuss.channel"].create({ name: "General", channel_member_ids: [] });
    const { env } = await start();
    patchWithCleanup(env.services["bus_service"], {
        forceUpdateChannels() {
            step("update-channels");
        },
    });
    await openDiscuss();
    await click("[title='Add or join a channel']");
    await insertText(".o-discuss-ChannelSelector input", "General");
    await click(":nth-child(1 of .o-discuss-ChannelSelector-suggestion)");
    await contains(".o-mail-DiscussSidebarChannel", { text: "General" });
    await assertSteps(["update-channels"]);
});
