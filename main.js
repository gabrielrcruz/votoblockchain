import {
  login,
  insertVote,
  getListCandidates
} from './index.js';

$(document).ready(async () => {
  await login();
  await getListCandidates();
});

$('#insertVote').click(async () => {
  const candidate = $('#candidate').val();
  await insertVote(candidate);
  await getListCandidates();
});
