-- CreateTable
CREATE TABLE `Fatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `vencimento` DATETIME(3) NOT NULL,
    `emissao` DATETIME(3) NOT NULL,
    `parcela` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
