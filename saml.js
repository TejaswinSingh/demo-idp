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

  const pem = `-----BEGIN CERTIFICATE-----
MIIDHDCCAgSgAwIBAgIRAITwhNQdtaYWOkwMvG0hVEcwDQYJKoZIhvcNAQELBQAw
EjEQMA4GA1UEChMHQWNtZSBDbzAeFw0yNTA1MjYxMDA3MTBaFw0yNjA1MjYxMDA3
MTBaMBIxEDAOBgNVBAoTB0FjbWUgQ28wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQCZ8sl8kwx5fVIRb1OBL93CQFGuVC7bHIU1GOPRCn0EXnyy++LuT8MR
njECP9gXQkEgjrg1SFyRzTcyjSWnwDbhGNEtsHF1DQO1K6prG+y2DdvliqrJ0wYh
kDS6RbRwzeWyvB3XLlNTBZBsFMJdkw4VyErn2pMALB3j7cR8ZO6GwI2bXHivbZ/w
ES2CgqoRwttpNWDpYkHyHsZBkCg/kgO0SE/NUVXg7NUiEWLiqtf8MxiL7xmox7pa
dI05GwtXwb2DQq71BdZJVLLXkFoGshD6MF/mLSisEDQLnINi18lSCq9VbY8FuQos
xJov/BnhGJd4s6T9X3y5YLjrD3sPCftJAgMBAAGjbTBrMA4GA1UdDwEB/wQEAwIC
pDATBgNVHSUEDDAKBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQW
BBRemV9Tsapk9cQnsGeKCD5OejQexDAUBgNVHREEDTALgglsb2NhbGhvc3QwDQYJ
KoZIhvcNAQELBQADggEBAFnInOkWGcNMzm2PHEB/JV4s1EwltRZCd9dJmb80pnBV
nHK7zE9W9KrGDBweQrn0Z71hxBbyCO+CkotzBPW+KToT3+Af526M2TzP8vEZGwDG
Y4X+WlIw1KGwiqxqOFSsD5Ikfgwcmlrm7Lkj9ANySmljQefyc5bCZHBuSDCmrYBa
W5Mz82Hm+3xhIrBTDfHvA00Zs/4l8bp95wZSfq5vDJBcSyovXPqM31GSJJpapcJS
sATCLCRrnDbQMmbpxu+7ZnHVkwzez619DvrPr1bBjDimhJBxAZPNPt6WjnUJBxz3
ePzDWKZXVEvGkFr6DBeftJ5QnRscZqNkkkgElUFs5Nw=
-----END CERTIFICATE-----

`;

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
