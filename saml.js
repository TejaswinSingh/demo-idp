document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const now = new Date();
  const notBefore = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const notOnOrAfter = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
  const assertionId = "_fakeid" + Date.now();
  const issueInstant = now.toISOString();
  const issuer = "https://tejaswinsingh.github.io/demo-idp/";

  const samlAssertion = `
<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  ID="${assertionId}" Version="2.0" IssueInstant="${issueInstant}" Destination="https://accounts.zoho.in/signin/samlsp/60041230659">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${issuer}</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${assertionId}-a" IssueInstant="${issueInstant}" Version="2.0">
    <saml:Issuer>${issuer}</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">${email}</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}" Recipient="https://accounts.zoho.in/signin/samlsp/60041230659"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="${notBefore}" NotOnOrAfter="${notOnOrAfter}">
      <saml:AudienceRestriction>
        <saml:Audience>zoho.com</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="${issueInstant}" SessionIndex="${assertionId}-s">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
  </saml:Assertion>
</samlp:Response>`;

  const pem = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVO7b9O+/Z+/46
JbhzIEbEUSruRotVkHTeXOLmFmK6fLWYpXKhS7pc5EexinLwri2yVPPxLgFICMq2
sZEatM/msO1ykzf/YzZwNG4yycxpcfat1n1u3shHObpIwB2vK8KDoAE+/B/CwdvT
yHzbZ9FpJI+mIpWoMYw9Cg1+q/R9uHMD38/0tB7q1mVv1bnE48/SweA3IsYhJk9p
iVCdlpYgZGTpJ08Z2/XwvrUeUpD+jrFJKTr2APAe8FBoLQPq9Zm1lg74D849oqBp
5mCenQFfRMp/yttAfcPaG9X8Ijm9XaMBD4ynJPopneVmtEZkIp327sDD7rUYI7T7
B0PMxMc3AgMBAAECggEAAkbF7a7YdlpOB4Q5k45nqFbkKhu6BxV+D0BXR8o7ZERK
krD0KAFX9v/qPVyosiXEj8p/uYvFMGYE9q2vSpAIRtfitmjDSJ21ihMf42OWJBYM
YnoPaBdGyhk1V5YoJaOboFjH9UqEcvQriveb+verxlSWmAPMgeQthsVMXurVDGEz
vpOeWr8GrMyQFE64VeKVBT4Vpn7J7WCi1E5Es1IT2gBR8vEE1/D2AbOrbsxNSOCE
C5mJAKjxafh/juSur3vNMOJqW0/rXGcClr/I8gnem94B2sHRVqWigVp5qFR8t2hw
rKvMff0wxdHOvdzEvmSnLMtfyDTiTL8ZrUqQDMDvaQKBgQDmcD8E4CeK6YD2JWNR
DrzRLtiz1K3Y6Vz3Zp5v4VuxfHdJe0bG1KY9Vkw8onN0QMOTPopa7S8vyLAO/wfP
U2gDgG+M8nzNPHbmFq9cfIZxtHF/gSZlH8gKHB/0WWCQCm3FBSgMCPpBP6JNBuF1
4pHH+gR1zLSJlvdbcqVsqtkApQKBgQDs4uShPEqvof5l0z2bl7EXV0ecn0cJNWKT
Tn+rloC2/1XkNM9qCcN2A1ToB9wnpw8zdvSEPzwTbNijNCAdevUhXDNZBRt6XKEP
LWRBDqRKADfFKmzPuO3lCxJRjAS5tueLIWrrK0WkLTdGDFYRkzooBvWL4aPZMWKX
Gki2kxulqwKBgBBfCRsfka+cxzy1i0jG80MpQNwF0BQJAEHTWI46RHlnjlH6IB0g
Hm9dIi1snSc1Mq/TUaEEGMYcS+XE2JkyI8Gb7lDlKVirYwcVtX+smSCa4TVdx4yH
pX6SYPLLJsEU/JdytlWkjaL1EmLGil4FqrW6XXbBBFKCFzC4BGij+qbBAoGBALuN
KNc/lSJZb8HO7ggyodOJFvm6YdO4oMNgc1S3ZFF+99ImvdGGyWq2WJMdJgF/E1n7
5LyQFFCM7TjKHGM65rny9fSVRpwqmpoZpjacERdF9OH2JRCRqkid63MFGPixB8Hw
Q2bOa+UAp7KeMcbYekMWv3Jww/lCUHyyIr/q2QjhAoGASka8s39dNMaIC9F8sObF
vsSBtHdr+tY7Xmh1sH/9bpDpUAdsSilnklrk4I6F/vlIs6yK2WQOVn3pBuSdPX4V
XYUSOgYerIOSfxBewVZF6kQ8xmgHgn64C2PAyPA908wws4eBEFR09DipDKY1WfBE
mgZEC7k1sP5r2IR4JOm1K74=
-----END PRIVATE KEY-----`;

  const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
  sig.init(pem);
  sig.updateString(samlAssertion);
  const signature = sig.sign();

  const base64SAML = btoa(samlAssertion);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://accounts.zoho.in/signin/samlsp/60041230659';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'SAMLResponse';
  input.value = base64SAML;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
});
