<html>
    <head>
        <title><?php echo $title ?></title>
        <base href="/othello/" />
        <link rel="stylesheet" type="text/css" href="css/main.css" />
        <?php $this->load->view($head_content); ?>
    </head>
    <body>
        <h1><?=$title?></h1>
        <?php $this->load->view($main_content); ?>
    </body>
</html>