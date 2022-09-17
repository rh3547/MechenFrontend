import { PatchConfig } from '@ng-nuc/core';

const xmin = "xmin";

export const preparePatch = (patches: PatchConfig[], currentRecord: any) => {
	patches.forEach((patch) => {
		(patch.value != null) ? patch.value = String(patch.value) : patch.value = patch.value;
	});

	let concurrencyPatch = new PatchConfig()
	concurrencyPatch.op = "replace";
	concurrencyPatch.path = `/${xmin}`;
	concurrencyPatch.value = String(currentRecord[xmin]);
	patches.push(concurrencyPatch);
	return patches;
};
