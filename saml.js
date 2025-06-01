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
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOzqqLpNzS6Gt3
nlw4k7l3hVPPruBZaYFfGDnpk/FyIGYX+fggP/Pwj4qIlBhZcyimsxSm7Y+NcfSD
FMiON7oJsl4eGPQ7NcTcP531yuK91mAKF9qgLAwrK3LVY+s9rg37NvdRSLym5sI5
Ab0juS5mlTpY7qEcs84V8IGliccj17VPO5w3oKV8EYlUxbY7JogmA7k9ue+z4rft
U4/w1xcAnVB3gVnmJLrBmA1VQo2CeS6PkSwlwqtQ+s5IrBHHAwpjURrbjkhOP5MQ
T1s9PqSESUMYHKW5TzBDQhXTwg/yFPKCfcrsLu+UydbSoECl7dmtFOAdYVnCwsHo
v1vuAX9LAgMBAAECggEAIVq/suoSG4oU2yQVZ6KbxSUh0Vs5H/KeRQIZRQzxYiDL
lo5gcIMgCup7w29vRe4G3mv/prSl9IAumX2eoyFlxe6Ys23+5hXT/FneVig0zb1n
m/kg77hq9gN57+S/qiEKbDv/Q4LhumF5bcxT/xD85NqooHNMVN7DHFK/9jz0e1ki
0jvNMY3P7DKHoHvkq1RT8KFfmKoEUM9Tvgt82DCVE5fYb4Ik0ShPBCb+usS3N54C
Qf6zHirpGODAXf8Th4++6S0Vl4Z5KQIW95fh/HewH32FQczAX1OBbmSURtaAxSNt
LkFYtP5FxMSxfz538mevCaLxbffQZo/xr/Zx7V+9oQKBgQDlVd7MuFUmX7+H+LBq
bZzMQOCEjAKTh+J6X+wVMOADxjYnoTE9NEqHZSQBERCxobv7cJLyPXZ2zr4lGT7X
yZZhe/aRPu77zWTil8k90+xn3+rBH0G0P92OE9tghN0QsXhD8XKZM7a2O6uDdMdc
5c72zEgZN38/+evtwpd0ABGwiQKBgQDm2j/oBeHph+RwyxGJ0teX1VCKCvNBXXc9
27ND0++Vt+85UnKwjCO6DwwsYxy9ZtY+5EMH8iFOVPM+5FwXMf+QUqVn1cdXXcEQ
0teNDgWLLnoyWtjbMMnSlAI6xY0W/wVZzlrN+fvc2lerxO0buYq5k33keN2J3Ps/
r5L1csO0MwKBgDs8kvAOLPBcivx0IB1dcsLPfy69e2zgDH/PhwtyNGrFJ/fUiwNk
Hlwao9Iitk0rmYK48Tvg5FiLzlGG09SpHU7Q1j9uIgyoYQambjSqKMYr8Fcx26bT
WEb6mg+0QeWt8YKbOx6XXPp1LzglUdmNAoh8+6KH0zaTN32SZcxwuCEBAoGAXmUz
6H4vSDym7nA6ta6fNZimHCwqF7pOPd8OSFfrCb9ydHAAMay8FyJ8CdJlOBVK2eCg
gClD8THPXRInjdyF8c+5juHdZx4RCf4M4cKwBZ91nA2FyusCO7cFyl5pONQCrhwx
CTSFBmPJoZUel02hKgzjV38Mp4jSu9HhN7g7yf0CgYBsCuQhCegC5Ue+szqaU+ne
IifTEK9F2P6UpxcC9RzbC46ETdWkjAeFhfN9p6vH2P1yE8ztEyYCjd5Sl01FtyHn
/0J6Tr9+O9NKY9T1Qv+YD0dV+Kq/YPb9r1rmKlxMTPEMJfx7EQYDFFj50uupqwGD
bSqwVDzuRLQXVGATGNU8XQ==
-----END PRIVATE KEY-----
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
