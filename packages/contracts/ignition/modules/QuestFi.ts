import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("QuestFiModule", (m) => {
  const deployer = m.getAccount(0);

  const queryRegistry = m.contract('QuestRegistry', [deployer]);
  const badgeSBT = m.contract('BadgeSBT', [deployer]);

  return { queryRegistry, badgeSBT };
});
