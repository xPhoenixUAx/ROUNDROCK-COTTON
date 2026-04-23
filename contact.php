<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$redirectBase = 'contact.html';
$returnTo = trim((string) ($_POST['return_to'] ?? ''));

if ($returnTo !== '' && preg_match('/^[a-zA-Z0-9._\-\/]+$/', $returnTo) === 1) {
    $redirectBase = $returnTo;
}
$recipientEmail = 'support@roundrockagency.com';
$recipientName = 'ROUNDROCK COTTON s.r.o.';

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$budget = trim((string) ($_POST['budget'] ?? ''));
$details = trim((string) ($_POST['details'] ?? ''));
$website = trim((string) ($_POST['website'] ?? ''));

if ($website !== '') {
    header('Location: ' . $redirectBase . '?status=success');
    exit;
}

if ($name === '' || $email === '' || $details === '') {
    header('Location: ' . $redirectBase . '?status=error');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirectBase . '?status=invalid');
    exit;
}

$safeName = preg_replace("/[\r\n]+/", ' ', $name) ?: 'Website visitor';
$safeEmail = filter_var($email, FILTER_SANITIZE_EMAIL) ?: '';
$subject = 'New website inquiry from ' . $safeName;

$lines = [
    'New inquiry received from the ROUNDROCK COTTON website.',
    '',
    'Name: ' . $safeName,
    'Email: ' . $safeEmail,
    'Company: ' . ($company !== '' ? $company : 'Not provided'),
    'Service interest: ' . ($service !== '' ? $service : 'Not provided'),
    'Budget range: ' . ($budget !== '' ? $budget : 'Not provided'),
    '',
    'Project details:',
    $details,
];

$message = implode("\r\n", $lines);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $recipientName . ' <' . $recipientEmail . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
];

$sent = mail($recipientEmail, $subject, $message, implode("\r\n", $headers));

header('Location: ' . $redirectBase . ($sent ? '?status=success' : '?status=error'));
exit;
