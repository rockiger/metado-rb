/**
 *
 * PrivacyPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Navbar } from 'app/components/Navbar';
import { ContentPage } from 'app/components/UiComponents';

interface Props {}

export function PrivacyPage(props: Props) {
  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Description of PrivacyPage" />
      </Helmet>
      <Navbar />
      <main>
        <ContentPage>
          <h1>Privacy Policy</h1>
          <p>
            This Privacy Policy clarifies the nature, scope and purpose of the
            processing of personal data (hereinafter referred to as “Data”) in
            the course of the provision of our services, as well as our online
            offerings and related websites, features and content, and external
            online presence, such as web sites. our Social Media Profile
            (collectively referred to as the “Online Offering”). With regard to
            the terminology used, e.g. “Processing” or “Responsible” we refer to
            the definitions in Article 4 of the General Data Protection
            Regulation (GDPR).
          </p>
          <p>
            Responsible
            <br />
            Marco Laspe
            <br />
            Friesenweg 9<br />
            65189 Wiesbaden, Germany
            <br />
            privacy@fulcrum.wiki
          </p>
          <p>Types of processed data</p>
          <ul>
            <li>Inventory data (e.g., person master data, name or address).</li>
            <li>contact information (e.g., e-mail, phone numbers).</li>
            <li>content data (e.g., text input, photographs, videos).</li>
            <li>
              usage data (e.g., websites visited, interest in content, access
              times).
            </li>
            <li>
              Meta / communication data (e.g., device information, IP
              addresses).
            </li>
          </ul>
          <h2>Categories of affected persons</h2>
          <p>
            Visitors and users of the online offer (hereinafter we refer to the
            affected persons as “users”).
          </p>
          <h2>Purpose of processing</h2>
          <ul>
            <li>Provision of the online offer, its functions and contents.</li>
            <li>Answering contact requests and communicating with users.</li>
            <li>Safety measures.</li>
            <li>Audience measurement / Marketing</li>
          </ul>
          <h2>Used terms</h2>
          <p>
            “Personal data” means any information relating to an identified or
            identifiable natural person (hereinafter the “data subject”); a
            natural person is considered as identifiable, which can be
            identified directly or indirectly, in particular by means of
            assignment to an identifier such as a name, to an identification
            number, to location data, to an online identifier (eg cookie) or to
            one or more special features, are the expression of the physical,
            physiological, genetic, mental, economic, cultural or social
            identity of this natural person.
          </p>
          <p>
            “Processing” means any process performed with or without the aid of
            automated procedures, or any such process associated with personal
            data. The term goes far and includes virtually every handling of
            data.
          </p>
          <p>
            “Pseudonymisation” means the processing of personal data in such a
            way that the personal data can no longer be assigned to a specific
            data subject without additional information being provided, provided
            that such additional information is kept separate and subject to
            technical and organizational measures to ensure that the personal
            data not assigned to an identified or identifiable natural person.
          </p>
          <p>
            “Profiling” means any kind of automated processing of personal data
            that involves the use of such personal information to evaluate
            certain personal aspects pertaining to a natural person, in
            particular aspects relating to job performance, economic situation,
            health, personal To analyze or predict preferences, interests,
            reliability, behavior, whereabouts, or relocation of that natural
            person.
          </p>
          <p>
            ‘Responsible person’ means the natural or legal person, public
            authority, body or body which, alone or in concert with others,
            decides on the purposes and means of processing personal data.
          </p>
          <p>
            “Processor” means a natural or legal person, public authority, body
            or body that processes personal data on behalf of the controller.
            <br /> Relevant legal bases
            <br /> In accordance with Art. 13 GDPR, we inform you about the
            legal basis of our data processing. For users within the scope of
            the General Data Protection Regulation (DSGVO), i. the EU and the
            EEC, unless the legal basis in the data protection declaration is
            mentioned, the following applies:
            <br /> The legal basis for obtaining consent is Article 6 (1) lit. a
            and Art. 7 GDPR;
            <br /> The legal basis for the processing for the performance of our
            services and the execution of contractual measures as well as the
            response to inquiries is Art. 6 para. 1 lit. b DSGVO;
            <br /> The legal basis for processing to fulfill our legal
            obligations is Art. 6 para. 1 lit. c DSGVO;
            <br /> In the event that vital interests of the data subject or
            another natural person require the processing of personal data, Art.
            6 para. 1 lit. d DSGVO as legal basis.
            <br /> The legal basis for the processing required to carry out a
            task in the public interest or in the exercise of official authority
            which has been delegated to the controller is Article 6 (1) lit. e
            DSGVO.
          </p>
          <p>
            The legal basis for processing in order to safeguard our legitimate
            interests is Article 6 (1) lit. f DSGVO.
            <br />
            The processing of data for purposes other than those for which they
            were collected is governed by the provisions of Article 6 (4) GDPR.
            <br />
            The processing of special categories of data (pursuant to Art. 9 (1)
            GDPR) is governed by the provisions of Art. 9 (2) GDPR.
            <br />
            Safety measures
            <br />
            We will take appropriate technical and organizational measures in
            accordance with legal requirements, taking into account the state of
            the art, the implementation costs and the nature, scope,
            circumstances and purposes of the processing and the different
            likelihood and severity of the risk to the rights and freedoms of
            individuals to ensure a level of protection appropriate to the risk.
          </p>
          <p>
            Measures include, in particular, ensuring the confidentiality,
            integrity and availability of data by controlling physical access to
            the data, as well as their access, input, disclosure, availability
            and segregation. In addition, we have established procedures to
            ensure the enjoyment of data subject rights, the erasure of data and
            the response to data threats. Furthermore, we consider the
            protection of personal data already in the development or selection
            of hardware, software and procedures, according to the principle of
            data protection through technology design and privacy-friendly
            default settings.
            <br />
            Collaboration with contract processors, joint controllers and third
            parties
            <br />
            If, in the context of our processing, we disclose data to other
            persons and companies (contract processors, joint controllers or
            third parties), transmit them to them or otherwise grant them access
            to the data, this will only be done on the basis of a legal
            permission (eg if the data is transmitted to third parties, such as
            payment service providers, to fulfill the contract), users have
            consented to a legal obligation to do so or on the basis of our
            legitimate interests (eg the use of agents, webhosters, etc.).
          </p>
          <p>
            Insofar as we disclose data to other companies in our group of
            companies, or otherwise grant access to them, this is done in
            particular for administrative purposes as a legitimate interest and,
            in addition, based on a legal basis.
          </p>
          <h2> Transfers to third countries</h2>
          <p>
            {' '}
            If we process data in a third country (ie outside the European Union
            (EU), the European Economic Area (EEA) or the Swiss Confederation)
            or in the context of the use of third party services or disclosure,
            or transfer of data to other persons or companies This will only
            happen if it is to fulfill our (pre) contractual obligations, on the
            basis of your consent, on the basis of a legal obligation or on the
            basis of our legitimate interests. Subject to express consent or
            contractually required transmission, we process or disclose the data
            only in third countries with a recognized level of privacy,
            including those certified under the Privacy Shield, or on the basis
            of specific warranties such as: contractual obligation by so-called
            standard protection clauses of the European Commission, the
            existence of certifications or binding internal data protection
            regulations (Art. 44 to 49 GDPR, information page of the European
            Commission).
          </p>
          <h2>Rights of data subjects</h2>
          <p>
            Right to information: You have the right to request a confirmation
            as to whether the data in question is being processed and for
            information about this data as well as for further information and
            copying of the data in accordance with legal requirements.
          </p>
          <p>
            Right to rectification: you have accordingly. the legal requirements
            to request the completion of the data concerning you or the
            correction of the incorrect data concerning you.
          </p>
          <p>
            Right to cancellation and limitation of processing: In accordance
            with the statutory provisions, you have the right to demand that the
            relevant data be deleted immediately, or, alternatively, demand a
            restriction of the processing of the data in accordance with
            statutory provisions.
          </p>
          <p>
            Right to Data Portability: You have the right to receive data
            relating to you that you have provided to us in accordance with
            legal requirements in a structured, common and machine-readable
            format or to request their transmission to another person in charge.
          </p>
          <p>
            Complaint to the supervisory authority: Furthermore, in accordance
            with the statutory provisions, you have the right to file a
            complaint with the competent supervisory authority.
            <br /> Withdrawal
          </p>
          <p>
            You have the right to revoke granted consent with effect for the
            future.
          </p>
          <h2>Right to Object</h2>
          <p>
            Right to object: You have the right at any time, for reasons that
            arise from your particular situation, against the processing of
            personal data relating to you which, on the basis of Art. 6 para. 1
            lit. e or f DSGVO takes an objection; this also applies to profiling
            based on these provisions. If the personal data relating to you are
            processed for direct marketing purposes, you have the right to
            object at any time to the processing of your personal data for the
            purpose of such advertising; this also applies to profiling insofar
            as it is associated with such direct mail.
          </p>
          <h2>Cookies and right to object to direct mail</h2>
          <p>
            “Cookies” are small files that are stored on users’ computers.
            Different information can be stored within the cookies. A cookie
            serves primarily to store the information about a user (or the
            device on which the cookie is stored) during or after his visit to
            an online offer. Temporary cookies, or “session cookies” or
            “transient cookies”, are cookies that are deleted after a user
            leaves an online service and closes his browser. In such a cookie,
            e.g. the contents of a shopping cart are stored in an online shop or
            a login status. “Persistent” or “persistent” refers to cookies that
            remain stored even after the browser has been closed. Thus, e.g. the
            login status will be saved if users visit it after several days.
            Likewise, in such a cookie the interests of the users can be stored,
            which are used for range measurement or marketing purposes. A
            “third-party cookie” refers to cookies that are offered by providers
            other than the person responsible for providing the online offer
            (otherwise, if only their cookies are called “first-party cookies”).
          </p>
          <p>
            We can use temporary and permanent cookies and clarify this in the
            context of our privacy policy.
          </p>
          <p>
            If we ask users for consent to the use of cookies (for example, in
            the context of a cookie consent), the legal basis of this processing
            is Art. 6 para. 1 lit. a. DSGVO. Otherwise, the personal cookies of
            the users according to the following explanations in the context of
            this Privacy Policy on the basis of our legitimate interests (ie
            interest in the analysis, optimization and economic operation of our
            online offer within the meaning of Art. 6 para 1 lit. DSGVO) or if
            the use of cookies to provide our contractual services is required,
            in accordance with Art. Art. 6 para. 1 lit. b. DSGVO, or if the use
            of cookies is required for the performance of a task that is in the
            public interest or in the exercise of official authority, in
            accordance with. Art. 6 para. 1 lit. e. DSGVO, processed.
          </p>
          <p>
            If users do not want cookies stored on their machine, they will be
            asked to disable the option in their browser’s system settings.
            Saved cookies can be deleted in the system settings of the browser.
            The exclusion of cookies can lead to functional restrictions of this
            online offer.
          </p>
          <p>
            A general objection to the use of cookies used for online marketing
            purposes can be found in a variety of services, especially in the
            case of tracking, via the US website
            http://www.aboutads.info/choices/ or the EU site
            http://www.youronlinechoices.com/ be explained. Furthermore, the
            storage of cookies can be achieved by switching them off in the
            settings of the browser. Please note that not all features of this
            online offer may be used.
          </p>
          <h2>Deletion of data</h2>
          <p>
            The data processed by us will be deleted or restricted in accordance
            with legal requirements. Unless explicitly stated in this privacy
            statement, the data stored by us will be deleted as soon as they are
            no longer necessary for their intended purpose and the deletion does
            not conflict with any statutory storage requirements.
          </p>
          <p>
            Unless the data is deleted because it is required for other and
            legally permitted purposes, its processing will be restricted. That
            the data is blocked and not processed for other purposes. This
            applies, for example for data that must be kept for commercial or
            tax reasons.
          </p>
          <p>
            Changes and updates to the privacy policy
            <br />
            We ask you to inform yourself regularly about the content of our
            privacy policy. We will adjust the Privacy Policy as soon as the
            changes to the data processing we make require it. We will notify
            you as soon as the changes require your participation (eg consent)
            or other individual notification.
          </p>
          <h2>Google Cloud Services</h2>
          <p>
            We leverage Google’s cloud and cloud software services (called
            Software as a Service, such as Google Suite) for the following
            purposes: document storage and management, calendaring, e-mailing,
            spreadsheets and presentations, sharing documents, content and
            information with particular recipients or publication of web pages,
            forms or other content and information as well as chats and
            participation in audio and video conferencing.
          </p>
          <p>
            Here, the personal data of the users are processed, as far as they
            become part of the documents and contents processed within the
            described services or are part of communication processes. For this,
            e.g. Master data and contact data of users, data on transactions,
            contracts, other processes and their contents belong. Google also
            processes usage data and metadata used by Google for security and
            service optimization purposes.
          </p>
          <p>
            When using publicly available documents, websites or other content,
            Google may save cookies on users ‘computers for the purposes of web
            analysis or to remember users’ settings.
          </p>
          <p>
            We use Google Cloud services based on our legitimate interests. Art.
            6 para. 1 lit. f DSGVO on efficient and secure administrative and
            cooperation processes. Further, processing is based on a contract
            processing contract with Google
            (https://cloud.google.com/terms/data-processing-terms).
          </p>
          <p>
            For more information, see the Google Privacy Policy
            (https://www.google.com/policies/privacy) and the Google Cloud
            Services Security Advisory
            (https://cloud.google.com/security/privacy/). You may object to the
            processing of your data in the Google Cloud to us in accordance with
            legal requirements. Incidentally, the deletion of the data within
            Google’s cloud services is determined by the other processes in
            which the data is processed (e.g., deletion of data that is no
            longer required for storage or storage required for taxation
            purposes).
          </p>
          <p>
            The Google Cloud Services are offered by Google Ireland Limited. To
            the extent that a transfer to the US occurs, we refer to the Google
            US certification under the Privacy Shield
            (https://www.privacyshield.gov/participant?id=a2zt0000000000001L5AAI&amp;status=Active)
            and standard protection clauses (https://cloud.google. com / terms /
            data-processing-terms).
          </p>
          <h2>Google Analytics</h2>
          <p>
            We use Google Analytics, a Google Ireland Limited web analytics
            service, Gordon House, Barrow Street, Dublin 4, Ireland (“Google”).
            Google uses cookies. The information generated by the cookie about
            the use of the online offer by the users are usually transmitted to
            a Google server in the USA and stored there.
          </p>
          <p>
            Google will use this information on our behalf to evaluate the use
            of our online offer by users, to compile reports on the activities
            within this online offering and to provide us with further services
            related to the use of this online offer and the internet usage. In
            this case, pseudonymous user profiles of the processed data can be
            created.
          </p>
          <p>
            We only use Google Analytics with activated IP anonymization. This
            means that the IP address of the users is shortened by Google within
            member states of the European Union or in other contracting states
            of the Agreement on the European Economic Area. Only in exceptional
            cases will the full IP address be sent to a Google server in the US
            and shortened there.
          </p>
          <p>
            The IP address submitted by the user’s browser will not be merged
            with other data provided by Google. Users can prevent the storage of
            cookies by setting their browser software accordingly; Users may
            also prevent the collection by Google of the data generated by the
            cookie and related to their use of the online offer as well as the
            processing of such data by Google by downloading and installing the
            browser plug-in available under the following link:{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="http://tools.google.com/dlpage/gaoptout?hl=de"
            >
              http://tools.google.com/dlpage/gaoptout?hl=de
            </a>
            .
          </p>
          <p>
            If we ask users for consent (for example, in the context of a cookie
            consent), the legal basis of this processing is Art. 6 (1) lit. a.
            DSGVO. Otherwise, the personal data of the users are processed on
            the basis of our legitimate interests (ie interest in the analysis,
            optimization and economic operation of our online offer within the
            meaning of Article 6 (1) (f) of the DSGVO).
          </p>
          <p>
            As far as data is processed in the US, we point out that Google is
            certified under the Privacy Shield Agreement, thereby ensuring
            compliance with European data protection law (
            <a href="https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&amp;status=Active">
              https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&amp;status=Active
            </a>
            ).
          </p>
          <p>
            For more information about Google’s data usage, hiring and
            disparaging options, please read Google’s Privacy Policy (
            <a href="https://policies.google.com/privacy)">
              https://policies.google.com/privacy)
            </a>{' '}
            and Google’s Ads Ads Settings{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://adssettings.google.com/authenticated"
            >
              (https://adssettings.google.com/authenticated
            </a>
            ).
          </p>
          <p>
            The personal data of users will be deleted or anonymized after 14
            months.
          </p>
          <p>
            <a href="https://datenschutz-generator.de/">
              Created with Datenschutz-Generator.de by RA Dr. med. Thomas
              Schwenke
            </a>
          </p>
        </ContentPage>
      </main>
    </>
  );
}
