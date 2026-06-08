'use client'
import React from 'react'
import styles from './Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useImagePath } from '@/lib/useImagePath'

export default function Footer() {
    const t = useTranslations('footer')

    return (
        <div className={styles.footerContent}>
            <div>

                {/* Logo + Description */}
                <div>
                    <Image src={useImagePath("/images/logo.png")} alt='logo' width={140} height={80} />
                    <p>{t('description')}</p>

                    <div className={styles.iconsFooter} style={{flexDirection:"row"}}>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-linkedin-in"></i>
                        <i className="fa-brands fa-youtube"></i>
                    </div>
                </div>

                {/* Product */}
                <div>
                    <h3>{t('product')}</h3>
                    <Link href="#">{t('features')}</Link>
                    <Link href="#">{t('pricing')}</Link>
                    <Link href="#">{t('caseStudies')}</Link>
                    <Link href="#">{t('reviews')}</Link>
                    <Link href="#">{t('updates')}</Link>
                </div>

                {/* Company */}
                <div>
                    <h3>{t('company')}</h3>
                    <Link href="#">{t('about')}</Link>
                    <Link href="#">{t('contact')}</Link>
                    <Link href="#">{t('culture')}</Link>
                    <Link href="#">{t('blog')}</Link>
                </div>

                {/* Support */}
                <div>
                    <h3>{t('support')}</h3>
                    <Link href="#">{t('gettingStarted')}</Link>
                    <Link href="#">{t('helpCenter')}</Link>
                    <Link href="#">{t('serverStatus')}</Link>
                    <Link href="#">{t('reportBug')}</Link>
                    <Link href="#">{t('chatSupport')}</Link>
                </div>

                {/* Contact Info */}
                <div>
                    <h3>{t('contacts')}</h3>

                    <div className={styles.iconsFooter} style={{flexDirection:"row"}}>
                        <i className="fa-regular fa-envelope"></i>
                        <Link href={`mailto:${t('email')}`}>
                            {t('email')}
                        </Link>
                    </div>

                    <div className={styles.iconsFooter} style={{flexDirection:"row"}}>
                        <i className="fa-solid fa-phone"></i>
                        <p>{t('phone')}</p>
                    </div>

                    <div className={styles.iconsFooter} style={{flexDirection:"row"}}>
                        <i className="fa-solid fa-location-dot"></i>
                        <p>{t('address')}</p>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div>
                <p>Copyright © {new Date().getFullYear()} ORB</p>
                <p>
                    {t('rights')} |
                    <Link href='#'>{t('terms')}</Link> |
                    <Link href='#'>{t('privacy')}</Link>
                </p>
            </div>
        </div>
    )
}
