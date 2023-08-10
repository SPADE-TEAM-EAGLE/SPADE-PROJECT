<!doctype html>
<html lang="en" dir="ltr">

<head>

    <!-- META DATA -->
    <meta charset="UTF-8">
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=0'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Sash – Bootstrap 5  Admin & Dashboard Template">
    <meta name="author" content="Spruko Technologies Private Limited">
    <meta name="keywords"
        content="admin,admin dashboard,admin panel,admin template,bootstrap,clean,dashboard,flat,jquery,modern,responsive,premium admin templates,responsive admin,ui,ui kit.">

    <!-- FAVICON -->
    <link rel="shortcut icon" type="image/x-icon" href="../assets/images/brand/favicon.ico" />

    <!-- TITLE -->
    <title>Sash – Bootstrap 5 Admin & Dashboard Template </title>

    <!-- BOOTSTRAP CSS -->
    <link id="style" href="../assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

    <!-- STYLE CSS -->
    <link href="../assets/css/style.css" rel="stylesheet" />
    <link href="../assets/css/dark-style.css" rel="stylesheet" />
    <link href="../assets/css/transparent-style.css" rel="stylesheet">
    <link href="../assets/css/skin-modes.css" rel="stylesheet" />

    <!--- FONT-ICONS CSS -->
    <link href="../assets/css/icons.css" rel="stylesheet" />

    <!-- COLOR SKIN CSS -->
    <link id="theme" rel="stylesheet" type="text/css" media="all" href="../assets/colors/color1.css" />
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    .border {
        border: 0px solid #e9edf4 !important;
        padding: 0.75rem;
        vertical-align: top;
        border: 1px solid #e9edf4;
    }

    .panel-body {
        padding: 0px;
    }

    .table-primary th {
        font-weight: 600 !important;
        vertical-align: middle !important;
    }

    .table td {
        vertical-align: middle !important;
    }

    /* .card-header {
        padding: 0.5rem 1rem;
    } */


    .table tbody img {
        width: 40px;
        border: transparent;
        border-radius: 5px;
        height: 40px;
    }

    .rounded-pill-Single-Family {
        color: #4A4AFF !important;
    }

    .rounded-pill-Multi-Family {
        color: #0BAAB8 !important;
        background: #C8F3F7;
    }

    .rounded-pill-Multi-Commercial {
        background: #FFF9E5;

        color: #F5CA38 !important;
    }

    .table-primary {
        background: #1467B014;
    }

    .btn-group>.btn-group:not(:last-child)>.btn,
    .btn-group>.btn:not(:last-child):not(.dropdown-toggle) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .color-primary {
        color: #1467B0;
    }
    .border-model-line {
        border-left: 5px solid #1467B0;
    }
    .accordion-item:first-of-type .accordion-button {
  border-top-right-radius: calc(0.5rem - 1px);
  border-top-left-radius: calc(0.5rem - 1px);
}
    </style>

</head>

<body class="app sidebar-mini ltr light-mode">

    <!-- GLOBAL-LOADER -->
    <div id="global-loader">
        <img src="../assets/images/loader.svg" class="loader-img" alt="Loader">
    </div>
    <!-- /GLOBAL-LOADER -->
    <!-- Modal -->
    <div class="modal fade" id="largemodal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg " role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="text-justify ps-2 border-model-line">
                        <h2 class="modal-title">Create <strong class="color-primary">New Property</strong></h2>
                        <span class="">Spade Rent allows you to add a range of commercial and residential properties,
                            from condos and single-family homes to retail stores and parking lots.</span>
                    </div>
                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <span class="m-0 me-4 fs-1" style="font-weight: bold;">01</span>
                                <h3 class="m-0"><strong>Property Information</strong></h3>
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <div class="row">
                                    <div class="col-12">
                                        sad
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <span class="m-0 me-4 fs-1" style="font-weight: bold;">02</span>
                                <h3 class="m-0"><strong>Property Unit Information</strong></h3>
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
                                squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck
                                quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                                on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
                                excepteur butcher vice lomo.
                                Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
                                probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL EFFECTS -->
    <div class="modal fade" id="modaldemo8">
        <div class="modal-dialog modal-dialog-centered text-center" role="document">
            <div class="modal-content modal-content-demo">
                <div class="modal-header">
                    <div class="text-justify">
                        <h2 class="modal-title">Create <strong class="color-primary">New Property</strong></h2>
                        <span class="">Spade Rent allows you to add a range of commercial and residential properties,
                            from condos and single-family homes to retail stores and parking lots.</span>
                    </div>

                    <button aria-label="Close" class="btn-close" data-bs-dismiss="modal"><span
                            aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <h6>Why We Use Electoral College, Not Popular Vote</h6>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page
                        when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                        distribution of letters, as opposed to
                        using 'Content here, content here', making it look like readable English.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Save changes</button> <button class="btn btn-light"
                        data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL EFFECTS -->

    <!-- PAGE -->
    <div class="page">
        <div class="page-main">

            <!-- app-Header -->
            <div class="app-header header sticky">
                <div class="container-fluid main-container">
                    <div class="d-flex">
                        <a aria-label="Hide Sidebar" class="app-sidebar__toggle" data-bs-toggle="sidebar"
                            href="javascript:void(0)"></a>
                        <!-- sidebar-toggle-->
                        <a class="logo-horizontal " href="index.html">
                            <img src="../assets/images/brand/logo.png" class="header-brand-img desktop-logo" alt="logo">
                            <img src="../assets/images/brand/logo-3.png" class="header-brand-img light-logo1"
                                alt="logo">
                        </a>
                        <!-- LOGO -->
                        <!-- <div class="main-header-center ms-3 d-none d-lg-block">
                            <input type="text" class="form-control" id="typehead" placeholder="Search for results...">
                            <button class="btn px-0 pt-2"><i class="fe fe-search" aria-hidden="true"></i></button>
                        </div> -->
                        <div class="d-flex order-lg-2 ms-auto header-right-icons">
                            <!-- SEARCH -->
                            <button class="navbar-toggler navresponsive-toggler d-lg-none ms-auto" type="button"
                                data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent-4"
                                aria-controls="navbarSupportedContent-4" aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon fe fe-more-vertical"></span>
                            </button>
                            <div class="navbar navbar-collapse responsive-navbar p-0">
                                <div class="collapse navbar-collapse" id="navbarSupportedContent-4">
                                    <div class="d-flex order-lg-2">
                                        <!-- <div class="dropdown d-lg-none d-flex">
                                            <a href="javascript:void(0)" class="nav-link icon" data-bs-toggle="dropdown">
                                                <i class="fe fe-search"></i>
                                            </a>
                                            <div class="dropdown-menu header-search dropdown-menu-start">
                                                <div class="input-group w-100 p-2">
                                                    <input type="text" class="form-control" placeholder="Search....">
                                                    <div class="input-group-text btn btn-primary">
                                                        <i class="fa fa-search" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> -->
                                        <!-- LOGO -->

                                        <!-- COUNTRY -->
                                        <div class="d-flex country">
                                            <a class="nav-link icon theme-layout nav-link-bg layout-setting">
                                                <span class="dark-layout text-dark"><i class="fe fe-moon"></i></span>
                                                <span class="light-layout"><i class="fe fe-sun"></i></span>
                                            </a>
                                        </div>


                                        <!-- 1 comments start  -->
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\comment.svg" 
                                                class="avatarr profile-user brroundd nav-link cover-image dark-layout">
                                        </div>
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\comment-light.webp" 
                                                class="avatarr profile-user nav-link brroundd cover-image light-layout">
                                        </div>
                                        <!-- 1 comments start  -->

                                        <!-- 2 comments start  -->
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\question.svg" 
                                                class="avatarr profile-user brroundd nav-link cover-image dark-layout">
                                        </div>
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\question-light.webp" 
                                                class="avatarr profile-user nav-link brroundd cover-image light-layout">
                                        </div>
                                        <!-- 2 comments start  -->

                                        <!-- 3 comments start  -->
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\spade.svg" 
                                                class="avatarr profile-user brroundd nav-link cover-image dark-layout">
                                        </div>
                                        <div class="d-flex country">
                                            <img src="../assets\header-img\circlels.png" 
                                                class="avatarr profile-user nav-link brroundd cover-image light-layout">
                                        </div>
                                        <!-- 3 comments start  -->

                                        <!-- <div class="d-flex country">
                                            <a class="nav-link icon text-center" data-bs-target="#country-selector"
                                                data-bs-toggle="modal">
                                                <i class="fe fe-globe"></i><span
                                                    class="fs-16 ms-2 d-none d-xl-block">English</span>
                                            </a>
                                        </div> -->

                                        <!-- Theme-Layout -->
                                        <!-- <div class="dropdown  d-flex shopping-cart">
                                            <a class="nav-link icon text-center" data-bs-toggle="dropdown">
                                                <i class="fe fe-shopping-cart"></i><span class="badge bg-secondary header-badge">4</span>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <div class="drop-heading border-bottom">
                                                    <div class="d-flex">
                                                        <h6 class="mt-1 mb-0 fs-16 fw-semibold text-dark"> My Shopping Cart</h6>
                                                        <div class="ms-auto">
                                                            <span class="badge bg-danger-transparent header-badge text-danger fs-14">Hurry Up!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="header-dropdown-list message-menu">
                                                    <div class="dropdown-item d-flex p-4">
                                                        <a href="cart.html" class="open-file"></a>
                                                        <span
                                                            class="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/pngs/4.jpg"></span>
                                                        <div class="wd-50p">
                                                            <h5 class="mb-1">Flower Pot for Home Decor</h5>
                                                            <span>Status: <span class="text-success">In Stock</span></span>
                                                            <p class="fs-13 text-muted mb-0">Quantity: 01</p>
                                                        </div>
                                                        <div class="ms-auto text-end d-flex fs-16">
                                                            <span class="fs-16 text-dark d-none d-sm-block px-4">
                                                                $438
                                                            </span>
                                                            <a href="javascript:void(0)" class="fs-16 btn p-0 cart-trash">
                                                                <i class="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="dropdown-item d-flex p-4">
                                                        <a href="cart.html" class="open-file"></a>
                                                        <span
                                                            class="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/pngs/6.jpg"></span>
                                                        <div class="wd-50p">
                                                            <h5 class="mb-1">Black Digital Camera</h5>
                                                            <span>Status: <span class="text-danger">Out Stock</span></span>
                                                            <p class="fs-13 text-muted mb-0">Quantity: 06</p>
                                                        </div>
                                                        <div class="ms-auto text-end d-flex">
                                                            <span class="fs-16 text-dark d-none d-sm-block px-4">
                                                                $867
                                                            </span>
                                                            <a href="javascript:void(0)" class="fs-16 btn p-0 cart-trash">
                                                                <i class="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="dropdown-item d-flex p-4">
                                                        <a href="cart.html" class="open-file"></a>
                                                        <span
                                                            class="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/pngs/8.jpg"></span>
                                                        <div class="wd-50p">
                                                            <h5 class="mb-1">Stylish Rockerz 255 Ear Pods</h5>
                                                            <span>Status: <span class="text-success">In Stock</span></span>
                                                            <p class="fs-13 text-muted mb-0">Quantity: 05</p>
                                                        </div>
                                                        <div class="ms-auto text-end d-flex">
                                                            <span class="fs-16 text-dark d-none d-sm-block px-4">
                                                                $323
                                                            </span>
                                                            <a href="javascript:void(0)" class="fs-16 btn p-0 cart-trash">
                                                                <i class="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="dropdown-item d-flex p-4">
                                                        <a href="cart.html" class="open-file"></a>
                                                        <span
                                                            class="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/pngs/1.jpg"></span>
                                                        <div class="wd-50p">
                                                            <h5 class="mb-1">Women Party Wear Dress</h5>
                                                            <span>Status: <span class="text-success">In Stock</span></span>
                                                            <p class="fs-13 text-muted mb-0">Quantity: 05</p>
                                                        </div>
                                                        <div class="ms-auto text-end d-flex">
                                                            <span class="fs-16 text-dark d-none d-sm-block px-4">
                                                                $867
                                                            </span>
                                                            <a href="javascript:void(0)" class="fs-16 btn p-0 cart-trash">
                                                                <i class="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="dropdown-item d-flex p-4">
                                                        <a href="cart.html" class="open-file"></a>
                                                        <span
                                                            class="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/pngs/3.jpg"></span>
                                                        <div class="wd-50p">
                                                            <h5 class="mb-1">Running Shoes for men</h5>
                                                            <span>Status: <span class="text-success">In Stock</span></span>
                                                            <p class="fs-13 text-muted mb-0">Quantity: 05</p>
                                                        </div>
                                                        <div class="ms-auto text-end d-flex">
                                                            <span class="fs-16 text-dark d-none d-sm-block px-4">
                                                                $456
                                                            </span>
                                                            <a href="javascript:void(0)" class="fs-16 btn p-0 cart-trash">
                                                                <i class="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="dropdown-divider m-0"></div>
                                                <div class="dropdown-footer">
                                                    <a class="btn btn-primary btn-pill w-sm btn-sm py-2" href="checkout.html"><i class="fe fe-check-circle"></i> Checkout</a>
                                                    <span class="float-end p-2 fs-17 fw-semibold">Total: $6789</span>
                                                </div>
                                            </div>
                                        </div> -->
                                        <!-- CART -->
                                        <!-- <div class="dropdown d-flex">
                                            <a class="nav-link icon full-screen-link nav-link-bg">
                                                <i class="fe fe-minimize fullscreen-button"></i>
                                            </a>
                                        </div> -->
                                        <!-- FULL-SCREEN -->
                                        <!-- <div class="dropdown  d-flex notifications">
                                            <a class="nav-link icon" data-bs-toggle="dropdown"><i
                                                    class="fe fe-bell"></i><span class=" pulse"></span>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <div class="drop-heading border-bottom">
                                                    <div class="d-flex">
                                                        <h6 class="mt-1 mb-0 fs-16 fw-semibold text-dark">Notifications
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div class="notifications-menu">
                                                    <a class="dropdown-item d-flex" href="notify-list.html">
                                                        <div class="me-3 notifyimg  bg-primary brround box-shadow-primary">
                                                            <i class="fe fe-mail"></i>
                                                        </div>
                                                        <div class="mt-1 wd-80p">
                                                            <h5 class="notification-label mb-1">New Application received
                                                            </h5>
                                                            <span class="notification-subtext">3 days ago</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="notify-list.html">
                                                        <div class="me-3 notifyimg  bg-secondary brround box-shadow-secondary">
                                                            <i class="fe fe-check-circle"></i>
                                                        </div>
                                                        <div class="mt-1 wd-80p">
                                                            <h5 class="notification-label mb-1">Project has been
                                                                approved</h5>
                                                            <span class="notification-subtext">2 hours ago</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="notify-list.html">
                                                        <div class="me-3 notifyimg  bg-success brround box-shadow-success">
                                                            <i class="fe fe-shopping-cart"></i>
                                                        </div>
                                                        <div class="mt-1 wd-80p">
                                                            <h5 class="notification-label mb-1">Your Product Delivered
                                                            </h5>
                                                            <span class="notification-subtext">30 min ago</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="notify-list.html">
                                                        <div class="me-3 notifyimg bg-pink brround box-shadow-pink">
                                                            <i class="fe fe-user-plus"></i>
                                                        </div>
                                                        <div class="mt-1 wd-80p">
                                                            <h5 class="notification-label mb-1">Friend Requests</h5>
                                                            <span class="notification-subtext">1 day ago</span>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div class="dropdown-divider m-0"></div>
                                                <a href="notify-list.html"
                                                    class="dropdown-item text-center p-3 text-muted">View all
                                                    Notification</a>
                                            </div>
                                        </div> -->
                                        <!-- NOTIFICATIONS -->
                                        <!-- <div class="dropdown  d-flex message">
                                            <a class="nav-link icon text-center" data-bs-toggle="dropdown">
                                                <i class="fe fe-message-square"></i><span class="pulse-danger"></span>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <div class="drop-heading border-bottom">
                                                    <div class="d-flex">
                                                        <h6 class="mt-1 mb-0 fs-16 fw-semibold text-dark">You have 5
                                                            Messages</h6>
                                                        <div class="ms-auto">
                                                            <a href="javascript:void(0)" class="text-muted p-0 fs-12">make all unread</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="message-menu message-menu-scroll">
                                                    <a class="dropdown-item d-flex" href="chat.html">
                                                        <span
                                                            class="avatar avatar-md brround me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/users/1.jpg"></span>
                                                        <div class="wd-90p">
                                                            <div class="d-flex">
                                                                <h5 class="mb-1">Peter Theil</h5>
                                                                <small class="text-muted ms-auto text-end">
                                                                    6:45 am
                                                                </small>
                                                            </div>
                                                            <span>Commented on file Guest list....</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="chat.html">
                                                        <span
                                                            class="avatar avatar-md brround me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/users/15.jpg"></span>
                                                        <div class="wd-90p">
                                                            <div class="d-flex">
                                                                <h5 class="mb-1">Abagael Luth</h5>
                                                                <small class="text-muted ms-auto text-end">
                                                                    10:35 am
                                                                </small>
                                                            </div>
                                                            <span>New Meetup Started......</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="chat.html">
                                                        <span
                                                            class="avatar avatar-md brround me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/users/12.jpg"></span>
                                                        <div class="wd-90p">
                                                            <div class="d-flex">
                                                                <h5 class="mb-1">Brizid Dawson</h5>
                                                                <small class="text-muted ms-auto text-end">
                                                                    2:17 pm
                                                                </small>
                                                            </div>
                                                            <span>Brizid is in the Warehouse...</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="chat.html">
                                                        <span
                                                            class="avatar avatar-md brround me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/users/4.jpg"></span>
                                                        <div class="wd-90p">
                                                            <div class="d-flex">
                                                                <h5 class="mb-1">Shannon Shaw</h5>
                                                                <small class="text-muted ms-auto text-end">
                                                                    7:55 pm
                                                                </small>
                                                            </div>
                                                            <span>New Product Realease......</span>
                                                        </div>
                                                    </a>
                                                    <a class="dropdown-item d-flex" href="chat.html">
                                                        <span
                                                            class="avatar avatar-md brround me-3 align-self-center cover-image"
                                                            data-bs-image-src="../assets/images/users/3.jpg"></span>
                                                        <div class="wd-90p">
                                                            <div class="d-flex">
                                                                <h5 class="mb-1">Cherry Blossom</h5>
                                                                <small class="text-muted ms-auto text-end">
                                                                    7:55 pm
                                                                </small>
                                                            </div>
                                                            <span>You have appointment on......</span>
                                                        </div>
                                                    </a>

                                                </div>
                                                <div class="dropdown-divider m-0"></div>
                                                <a href="javascript:void(0)" class="dropdown-item text-center p-3 text-muted">See all
                                                    Messages</a>
                                            </div>
                                        </div> -->
                                        <!-- MESSAGE-BOX -->
                                        <!-- <div class="dropdown d-flex header-settings">
                                            <a href="javascript:void(0);" class="nav-link icon"
                                                data-bs-toggle="sidebar-right" data-target=".sidebar-right">
                                                <i class="fe fe-align-right"></i>
                                            </a>
                                        </div> -->
                                        <!-- SIDE-MENU -->
                                        <div class="dropdown d-flex profile-1 country">
                                            <a href="javascript:void(0)" data-bs-toggle="dropdown"
                                                class="nav-link leading-none d-flex">
                                                <!-- <img src="../assets/images/users/21.jpg" 
                                                    class="avatar  profile-user brround cover-image"> -->
                                                <span class="side-menu__item dynamic-text-head text-dark"
                                                    style="padding: 10px 0px;">Spade Admin</span> <i
                                                    class="fe fe-chevron-down dark-mode"
                                                    style="font-size: 20px; font-weight: 800;"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <div class="drop-heading">
                                                    <div class="text-center">
                                                        <h5 class="text-dark mb-0 fs-14 fw-semibold">Percy Kewshun</h5>
                                                        <small class="text-muted">Senior Admin</small>
                                                    </div>
                                                </div>
                                                <div class="dropdown-divider m-0"></div>
                                                <a class="dropdown-item" href="profile.html">
                                                    <i class="dropdown-icon fe fe-user"></i> Profile
                                                </a>
                                                <a class="dropdown-item" href="email-inbox.html">
                                                    <i class="dropdown-icon fe fe-mail"></i> Inbox
                                                    <span class="badge bg-danger rounded-pill float-end">5</span>
                                                </a>
                                                <a class="dropdown-item" href="lockscreen.html">
                                                    <i class="dropdown-icon fe fe-lock"></i> Lockscreen
                                                </a>
                                                <a class="dropdown-item" onclick="logout()">
                                                    <i class="dropdown-icon fe fe-alert-circle"></i> Sign out
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /app-Header -->
            <!--APP-SIDEBAR-->
            <div class="sticky">
                <div class="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
                <div class="app-sidebar">
                    <div class="side-header">
                        <a class="header-brand1" href="index.php">
                            <img src="../assets/images/logo_white.png" class="header-brand-img desktop-logo" alt="logo">
                            <img src="../assets/images/logo_white.png" class="header-brand-img toggle-logo" alt="logo">
                            <img src="../assets/images/Artboard GÇô 1.svg" class="header-brand-img light-logo"
                                alt="logo">
                            <img src="../assets/images/Artboard GÇô 1.svg" class="header-brand-img light-logo1"
                                alt="logo">
                        </a>
                        <!-- LOGO -->
                    </div>
                    <div class="main-sidemenu">
                        <div class="slide-left disabled" id="slide-left"><svg xmlns="http://www.w3.org/2000/svg"
                                fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                            </svg></div>
                        <ul class="side-menu">
                            <li class="sub-category">
                                <!-- <h3>Main</h3> -->
                            </li>
                            <li class="slide">
                                <a href="javascript:void(0)"
                                    class="btn btn-outline-primary btn-pill btn-xl w-100 create-btn"><i
                                        class="angle fe fe-plus-square create-btn-plus"></i>&nbsp;Create New</a>
                            </li>
                            <li class="slide">
                                <div class="card" style="box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;">
                                    <div class="card-header pb-0 border-bottom-0">
                                        <h3 class="card-title"><i class="fa fa-send mb-0"></i>&nbsp; Complete your
                                            Profile</h3>

                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="progress progress-md mt-5">
                                            <div class="progress-bar bg-info" style="width: 40%;"> 40%</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="slide">
                                <a class="side-menu__item has-link" data-bs-toggle="slide" href="index.php"><i
                                        class="side-menu__icon fe fe-home"></i><span
                                        class="side-menu__label">Dashboard</span></a>
                            </li>
                            <!-- <li class="sub-category">
                                <h3>UI Kit</h3>
                            </li> -->
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-slack"></i><span
                                        class="side-menu__label">Properties</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <!-- <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Properties</a></li>
                                    <li><a href="properties-all.php" class="slide-item">All</a></li>
                                    <li><a href="calendar.php" class="slide-item">Draft</a></li>
                                </ul> -->
                            </li>
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-package"></i><span
                                        class="side-menu__label">Tenants</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu mega-slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Tenants</a></li>
                                    <div class="mega-menu">
                                        <div class="">
                                            <ul>
                                                <li><a href="alerts.php" class="slide-item"> Alerts</a></li>
                                                <li><a href="buttons.php" class="slide-item"> Buttons</a></li>
                                                <li><a href="colors.php" class="slide-item"> Colors</a></li>
                                                <li><a href="avatarsquare.php" class="slide-item"> Avatar Square</a>
                                                </li>
                                                <li><a href="avatar-radius.php" class="slide-item"> Avatar Radius</a>
                                                </li>
                                                <li><a href="avatar-round.php" class="slide-item"> Avatar Rounded</a>
                                                </li>
                                                <li><a href="dropdown.php" class="slide-item"> Dropdowns</a></li>
                                            </ul>
                                        </div>
                                        <div class="">
                                            <ul>
                                                <li><a href="listgroup.php" class="slide-item"> List Group</a></li>
                                                <li><a href="tags.php" class="slide-item"> Tags</a></li>
                                                <li><a href="pagination.php" class="slide-item"> Pagination</a></li>
                                                <li><a href="navigation.php" class="slide-item"> Navigation</a></li>
                                                <li><a href="typography.php" class="slide-item"> Typography</a></li>
                                                <li><a href="breadcrumbs.php" class="slide-item"> Breadcrumbs</a></li>
                                                <li><a href="badge.php" class="slide-item"> Badges / Pills</a></li>
                                            </ul>
                                        </div>
                                        <div class="">
                                            <ul>
                                                <li><a href="panels.php" class="slide-item"> Panels</a></li>
                                                <li><a href="thumbnails.php" class="slide-item"> Thumbnails</a></li>
                                                <li><a href="offcanvas.php" class="slide-item"> Offcanvas</a></li>
                                                <li><a href="toast.php" class="slide-item"> toast</a></li>
                                                <li><a href="scrollspy.php" class="slide-item"> Scrollspy</a></li>
                                                <li><a href="mediaobject.php" class="slide-item"> Media Object</a></li>
                                                <li><a href="accordion.php" class="slide-item"> Accordions </a></li>
                                            </ul>
                                        </div>
                                        <div class="">
                                            <ul>
                                                <li><a href="tabs.php" class="slide-item"> Tabs</a></li>
                                                <li><a href="modal.php" class="slide-item"> Modal</a></li>
                                                <li><a href="tooltipandpopover.php" class="slide-item"> Tooltip and
                                                        popover</a></li>
                                                <li><a href="progress.php" class="slide-item"> Progress</a></li>
                                                <li><a href="carousel.php" class="slide-item"> Carousels</a></li>
                                                <li><a href="ribbons.php" class="slide-item"> Ribbons</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </ul>
                            </li>

                            <!-- <li class="sub-category">
                                <h3>Pre-build Pages</h3>
                            </li> -->
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-layers"></i><span
                                        class="side-menu__label">Invoicing</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Invoicing</a></li>
                                    <li><a href="profile.php" class="slide-item"> Profile</a></li>
                                    <li><a href="editprofile.php" class="slide-item"> Edit Profile</a></li>
                                    <li><a href="notify-list.php" class="slide-item"> Notifications List</a></li>
                                    <li><a href="email-compose.php" class="slide-item"> Mail-Compose</a></li>
                                    <li><a href="email-inbox.php" class="slide-item"> Mail-Inbox</a></li>
                                    <li><a href="email-read.php" class="slide-item"> Mail-Read</a></li>
                                    <li><a href="gallery.php" class="slide-item"> Gallery</a></li>
                                    <li class="sub-slide">
                                        <a class="sub-side-menu__item" data-bs-toggle="sub-slide"
                                            href="javascript:void(0)"><span class="sub-side-menu__label">Forms</span><i
                                                class="sub-angle fe fe-chevron-right"></i></a>
                                        <ul class="sub-slide-menu">
                                            <li><a href="form-elements.php" class="sub-slide-item"> Form Elements</a>
                                            </li>
                                            <li><a href="form-layouts.php" class="sub-slide-item"> Form Layouts</a>
                                            </li>
                                            <li><a href="form-advanced.php" class="sub-slide-item"> Form Advanced</a>
                                            </li>
                                            <li><a href="form-editor.php" class="sub-slide-item"> Form Editor</a></li>
                                            <li><a href="form-wizard.php" class="sub-slide-item"> Form Wizard</a></li>
                                            <li><a href="form-validation.php" class="sub-slide-item"> Form
                                                    Validation</a></li>
                                            <li><a href="form-input-spinners.php" class="sub-slide-item"> Form Input
                                                    Spinners</a></li>
                                        </ul>
                                    </li>
                                    <li class="sub-slide">
                                        <a class="sub-side-menu__item" data-bs-toggle="sub-slide"
                                            href="javascript:void(0)"><span class="sub-side-menu__label">Tables</span><i
                                                class="sub-angle fe fe-chevron-right"></i></a>
                                        <ul class="sub-slide-menu">
                                            <li><a href="tables.php" class="sub-slide-item">Default table</a></li>
                                            <li><a href="datatable.php" class="sub-slide-item"> Data Tables</a></li>
                                            <li><a href="edit-table.php" class="sub-slide-item"> Edit Tables</a></li>
                                            <li><a href="extension-tables.php" class="sub-slide-item"> Extension
                                                    Tables</a></li>
                                        </ul>
                                    </li>
                                    <li class="sub-slide">
                                        <a class="sub-side-menu__item" data-bs-toggle="sub-slide"
                                            href="javascript:void(0)"><span
                                                class="sub-side-menu__label">Extension</span><i
                                                class="sub-angle fe fe-chevron-right"></i></a>
                                        <ul class="sub-slide-menu">
                                            <li><a href="about.php" class="sub-slide-item"> About Company</a></li>
                                            <li><a href="services.php" class="sub-slide-item"> Services</a></li>
                                            <li><a href="faq.php" class="sub-slide-item"> FAQS</a></li>
                                            <li><a href="terms.php" class="sub-slide-item"> Terms</a></li>
                                            <li><a href="invoice.php" class="sub-slide-item"> Invoice</a></li>
                                            <li><a href="pricing.php" class="sub-slide-item"> Pricing Tables</a></li>
                                            <li><a href="settings.html" class="sub-slide-item"> Settings</a></li>
                                            <li><a href="blog.php" class="sub-slide-item"> Blog</a></li>
                                            <li><a href="blog-details.php" class="sub-slide-item"> Blog Details</a>
                                            </li>
                                            <li><a href="blog-post.php" class="sub-slide-item"> Blog Post</a></li>
                                            <li><a href="empty.php" class="sub-slide-item"> Empty Page</a></li>
                                            <li><a href="construction.php" class="sub-slide-item"> Under
                                                    Construction</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="switcher-1.php" class="slide-item"> Switcher</a></li>
                                </ul>
                            </li>
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-shopping-bag"></i><span
                                        class="side-menu__label">Leads</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Leads</a></li>
                                    <li><a href="shop.php" class="slide-item"> Shop</a></li>
                                    <li><a href="shop-description.php" class="slide-item"> Product Details</a></li>
                                    <li><a href="cart.php" class="slide-item"> Shopping Cart</a></li>
                                    <li><a href="add-product.php" class="slide-item"> Add Product</a></li>
                                    <li><a href="wishlist.php" class="slide-item"> Wishlist</a></li>
                                    <li><a href="checkout.php" class="slide-item"> Checkout</a></li>
                                </ul>
                            </li>
                            <!-- <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-folder"></i><span class="side-menu__label">File
                                        Manager</span><span class="badge bg-pink side-badge">4</span><i
                                        class="angle fe fe-chevron-right hor-angle"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">File Manager</a></li>
                                    <li><a href="file-manager.php" class="slide-item"> File Manager</a></li>
                                    <li><a href="filemanager-list.php" class="slide-item"> File Manager List</a></li>
                                    <li><a href="filemanager-details.php" class="slide-item"> File Details</a></li>
                                    <li><a href="file-attachments.php" class="slide-item"> File Attachments</a></li>
                                </ul>
                            </li> -->
                            <!-- <li class="sub-category">
                                <h3>Misc Pages</h3>
                            </li> -->
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-users"></i><span
                                        class="side-menu__label">Tasks</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Tasks</a></li>
                                    <li><a href="login.php" class="slide-item"> Login</a></li>
                                    <li><a href="register.php" class="slide-item"> Register</a></li>
                                    <li><a href="forgot-password.php" class="slide-item"> Forgot Password</a></li>
                                    <li><a href="lockscreen.php" class="slide-item"> Lock screen</a></li>
                                    <li class="sub-slide">
                                        <a class="sub-side-menu__item" data-bs-toggle="sub-slide"
                                            href="javascript:void(0)"><span class="sub-side-menu__label">Error
                                                Pages</span><i class="sub-angle fe fe-chevron-right"></i></a>
                                        <ul class="sub-slide-menu">
                                            <li><a href="400.php" class="sub-slide-item"> 400</a></li>
                                            <li><a href="401.php" class="sub-slide-item"> 401</a></li>
                                            <li><a href="403.php" class="sub-slide-item"> 403</a></li>
                                            <li><a href="404.php" class="sub-slide-item"> 404</a></li>
                                            <li><a href="500.php" class="sub-slide-item"> 500</a></li>
                                            <li><a href="503.php" class="sub-slide-item"> 503</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)">
                                    <i class="side-menu__icon fe fe-cpu"></i>
                                    <span class="side-menu__label">Reports</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Reports</a></li>
                                    <li><a href="javascript:void(0)" class="slide-item">Submenu-1</a></li>
                                    <li class="sub-slide">
                                        <a class="sub-side-menu__item" data-bs-toggle="sub-slide"
                                            href="javascript:void(0)"><span
                                                class="sub-side-menu__label">Submenu-2</span><i
                                                class="sub-angle fe fe-chevron-right"></i></a>
                                        <ul class="sub-slide-menu">
                                            <li><a class="sub-slide-item" href="javascript:void(0)">Submenu-2.1</a></li>
                                            <li><a class="sub-slide-item" href="javascript:void(0)">Submenu-2.2</a></li>
                                            <li class="sub-slide2">
                                                <a class="sub-side-menu__item2" href="javascript:void(0)"
                                                    data-bs-toggle="sub-slide2"><span
                                                        class="sub-side-menu__label2">Submenu-2.3</span><i
                                                        class="sub-angle2 fe fe-chevron-right"></i></a>
                                                <ul class="sub-slide-menu2">
                                                    <li><a href="javascript:void(0)"
                                                            class="sub-slide-item2">Submenu-2.3.1</a></li>
                                                    <li><a href="javascript:void(0)"
                                                            class="sub-slide-item2">Submenu-2.3.2</a></li>
                                                    <li><a href="javascript:void(0)"
                                                            class="sub-slide-item2">Submenu-2.3.3</a></li>
                                                </ul>
                                            </li>
                                            <li><a class="sub-slide-item" href="javascript:void(0)">Submenu-2.4</a></li>
                                            <li><a class="sub-slide-item" href="javascript:void(0)">Submenu-2.5</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <!-- <li class="sub-category">
                                <h3>General</h3>
                            </li> -->
                            <!-- <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-map-pin"></i><span
                                        class="side-menu__label">Maps</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Maps</a></li>
                                    <li><a href="maps1.php" class="slide-item">Leaflet Maps</a></li>
                                    <li><a href="maps2.php" class="slide-item">Mapel Maps</a></li>
                                    <li><a href="maps.php" class="slide-item">Vector Maps</a></li>
                                </ul>
                            </li> -->
                            <!-- <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-bar-chart-2"></i><span
                                        class="side-menu__label">Charts</span><span
                                        class="badge bg-secondary side-badge">6</span><i
                                        class="angle fe fe-chevron-right hor-angle"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Charts</a></li>
                                    <li><a href="chart-chartist.php" class="slide-item">Chart Js</a></li>
                                    <li><a href="chart-flot.php" class="slide-item"> Flot Charts</a></li>
                                    <li><a href="chart-echart.php" class="slide-item"> ECharts</a></li>
                                    <li><a href="chart-morris.php" class="slide-item"> Morris Charts</a></li>
                                    <li><a href="chart-nvd3.php" class="slide-item"> Nvd3 Charts</a></li>
                                    <li><a href="charts.php" class="slide-item"> C3 Bar Charts</a></li>
                                    <li><a href="chart-line.php" class="slide-item"> C3 Line Charts</a></li>
                                    <li><a href="chart-donut.php" class="slide-item"> C3 Donut Charts</a></li>
                                    <li><a href="chart-pie.php" class="slide-item"> C3 Pie charts</a></li>
                                </ul>
                            </li> -->
                            <!-- <li class="slide">
                                <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)"><i
                                        class="side-menu__icon fe fe-wind"></i><span
                                        class="side-menu__label">Icons</span><i
                                        class="angle fe fe-chevron-right"></i></a>
                                <ul class="slide-menu">
                                    <li class="side-menu-label1"><a href="javascript:void(0)">Icons</a></li>
                                    <li><a href="icons.php" class="slide-item"> Font Awesome</a></li>
                                    <li><a href="icons2.php" class="slide-item"> Material Design Icons</a></li>
                                    <li><a href="icons3.php" class="slide-item"> Simple Line Icons</a></li>
                                    <li><a href="icons4.php" class="slide-item"> Feather Icons</a></li>
                                    <li><a href="icons5.php" class="slide-item"> Ionic Icons</a></li>
                                    <li><a href="icons6.php" class="slide-item"> Flag Icons</a></li>
                                    <li><a href="icons7.php" class="slide-item"> pe7 Icons</a></li>
                                    <li><a href="icons8.php" class="slide-item"> Themify Icons</a></li>
                                    <li><a href="icons9.php" class="slide-item">Typicons Icons</a></li>
                                    <li><a href="icons10.php" class="slide-item">Weather Icons</a></li>
                                    <li><a href="icons11.php" class="slide-item">Bootstrap Icons</a></li>
                                </ul>
                            </li> -->
                            <li>
                                <a class="side-menu__item has-link" href="landing-page.php" target="_blank"><i
                                        class="side-menu__icon fe fe-zap"></i><span
                                        class="side-menu__label">Settings</span>
                                    <!-- <span
                                        class="badge bg-green br-5 side-badge blink-text pb-1">New</span> -->
                                </a>
                            </li>
                        </ul>
                        <div class="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191"
                                width="24" height="24" viewBox="0 0 24 24">
                                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
                            </svg></div>
                    </div>
                </div>
                <!--/APP-SIDEBAR-->
            </div>
            <!--app-content open-->
            <div class="main-content app-content mt-0">
                <div class="side-app">

                    <!-- CONTAINER -->
                    <div class="main-container container-fluid">

                        <!-- PAGE-HEADER -->
                        <!-- <div class="page-header">
                            <h1 class="page-title">Dashboard 01</h1>
                            <div>
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Dashboard 01</li>
                                </ol>
                            </div>
                        </div> -->

                        <div class="card mt-5" style="background: linear-gradient(180deg, #232323 0%, #434343 100%);">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-lg-9">
                                        <h3 class="page-titlee text-white"
                                            style="font-weight: 100; margin-bottom: 0px;">Welcome To Spade Rent Portal</h3>
                                        <h1 class="page-titlee text-white" style="font-weight: 700;"></h1>
                                        <a href="javascript:void(0)"
                                            class="btn btn-primary btn-pill btn-xl email-verification-btn"><i
                                                class="angle fe fe-mail create-btn-plus"></i>&nbsp;Complete email
                                            verification &nbsp; <i
                                                class="angle fe fe-arrow-right create-btn-plus"></i></a>
                                    </div>
                                    <div class="col-lg-3">
                                        <img src="../assets/header-img/Group1.png" alt="">
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- PAGE-HEADER END -->

                        <!-- Row -->
                        <div class="row">
                            <div class="col-lg-12 col-xl-12">
                                <div class="card">
                                    <div class="card-header justify-content-between">
                                        <div class="d-flex">
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-dark font-weight-bold"
                                                    data-bs-toggle="dropdown"><i
                                                        class="typcn typcn-filter me-2"></i><strong id="Filter-btn">Filter</strong></button>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li><a href="javascript:void(0)"><strong>Filter by:</strong></a>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">A-Z </a>
                                                        <div class="form-check m-0">
                                                            <input class="form-check-input mt-2" type="radio"
                                                                name="exampleRadios" id="exampleRadios1" value="option1"
                                                                checked>
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Date Modified</a>
                                                        <div class="form-check m-0">
                                                            <input class="form-check-input mt-2" type="radio"
                                                                name="exampleRadios" id="exampleRadios1" value="option1"
                                                                checked>
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Ascending</a>
                                                        <div class="form-check m-0">
                                                            <input class="form-check-input mt-2" type="radio"
                                                                name="exampleRadios" id="exampleRadios1" value="option1"
                                                                checked>
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Descending</a>
                                                        <div class="form-check m-0">
                                                            <input class="form-check-input mt-2" type="radio"
                                                                name="exampleRadios" id="exampleRadios1" value="option1"
                                                                checked>
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Recently Added</a>
                                                        <div class="form-check m-0">
                                                            <input class="form-check-input mt-2" type="radio"
                                                                name="exampleRadios" id="exampleRadios1" value="option1"
                                                                checked>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mx-2">
                                                <div class="form-group m-0">
                                                    <input class="form-control"
                                                        placeholder="Search Users by Name, Email or Date" type="text">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex">
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-dark font-weight-bold"
                                                    data-bs-toggle="dropdown"><strong>CUSTOMIZED</strong><i
                                                        class="fe fe-chevron-down ms-2"></i></button>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li><a href="javascript:void(0)"><strong>Filter by:</strong></a>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">A-Z </a>
                                                        <div class="form-check m-0">
                                                            <input type="checkbox" class="form-check-input mt-2"
                                                                id="exampleCheck1">
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Date Modified</a>
                                                        <div class="form-check m-0">
                                                            <input type="checkbox" class="form-check-input mt-2"
                                                                id="exampleCheck1">
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Ascending</a>
                                                        <div class="form-check m-0">
                                                            <input type="checkbox" class="form-check-input mt-2"
                                                                id="exampleCheck1">
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Descending</a>
                                                        <div class="form-check m-0">
                                                            <input type="checkbox" class="form-check-input mt-2"
                                                                id="exampleCheck1">
                                                        </div>
                                                    </li>
                                                    <li class="d-flex justify-content-between"><a
                                                            href="javascript:void(0)">Recently Added</a>
                                                        <div class="form-check m-0">
                                                            <input type="checkbox" class="form-check-input mt-2"
                                                                id="exampleCheck1">
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <button type="button" class="btn btn-primary mx-2"
                                                data-bs-effect="effect-scale" data-bs-toggle="modal"
                                                href="#largemodal"><i class="fe fe-plus me-2"></i><strong>ADD NEW
                                                    PROPERTY</strong></button>
                                        </div>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="table-responsive">
                                            <table class="table border text-nowrap text-md-nowrap mb-0">
                                                <thead class="table-primary">
                                                    <tr>
                                                        <th><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></th>
                                                        <th></th>
                                                        <th>PROPERTY ID</th>
                                                        <th>PROPERTY NAME</th>
                                                        <th>PROPERTY TYPE</th>
                                                        <th>PROPERTY UNITS</th>
                                                        <th>PROPERTY ADDRESS</th>
                                                        <th><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></td>
                                                        <td><img src="https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336__340.jpg"
                                                                alt=""></td>
                                                        <td style="font-weight: 600;">US-272723</td>
                                                        <td style="font-weight: 600;"></td>
                                                        <td><a class="like" href="javascript:;">
                                                                <span
                                                                    class="badge btn-light rounded-pill-Single-Family rounded-pill py-2 px-3">
                                                                    <i class="fe fe-circle me-1"></i>Single
                                                                    Family</span>
                                                            </a></td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">1 Unit (s)</p>
                                                            <span class="font-weight-normal">220 Square Feet</span>
                                                        </td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">9430 Research
                                                                Blvd. Ste 2-350 Austin</p>
                                                            <span>TX 78759</span>
                                                        </td>
                                                        <td><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></td>
                                                    </tr>
                                                    <tr>
                                                        <td><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></td>
                                                        <td><img src="https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336__340.jpg"
                                                                alt=""></td>
                                                        <td>US-272723</td>
                                                        <td></td>
                                                        <td><a class="like" href="javascript:;">
                                                                <span
                                                                    class="badge btn-light rounded-pill-Single-Family rounded-pill py-2 px-3">
                                                                    <i class="fe fe-circle me-1"></i>Single
                                                                    Family</span>
                                                            </a></td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">1 Unit (s)</p>
                                                            <span>220 Square Feet</span>
                                                        </td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">9430 Research
                                                                Blvd. Ste 2-350 Austin</p>
                                                            <span>TX 78759</span>
                                                        </td>
                                                        <td><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></td>
                                                    </tr>
                                                    <tr>
                                                        <td><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></td>
                                                        <td><img src="https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336__340.jpg"
                                                                alt=""></td>
                                                        <td>US-272723</td>
                                                        <td></td>
                                                        <td><a class="like" href="javascript:;">
                                                                <span
                                                                    class="badge btn-light rounded-pill-Multi-Family rounded-pill py-2 px-3">
                                                                    <i class="fe fe-circle me-1"></i>Single
                                                                    Family</span>
                                                            </a></td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">1 Unit (s)</p>
                                                            <span>220 Square Feet</span>
                                                        </td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">9430 Research
                                                                Blvd. Ste 2-350 Austin</p>
                                                            <span>TX 78759</span>
                                                        </td>
                                                        <td><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></td>
                                                    </tr>
                                                    <tr>
                                                        <td><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></td>
                                                        <td><img src="https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336__340.jpg"
                                                                alt=""></td>
                                                        <td>US-272723</td>
                                                        <td></td>
                                                        <td><a class="like" href="javascript:;">
                                                                <span
                                                                    class="badge btn-light rounded-pill-Multi-Family rounded-pill py-2 px-3">
                                                                    <i class="fe fe-circle me-1"></i>Single
                                                                    Family</span>
                                                            </a></td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">1 Unit (s)</p>
                                                            <span>220 Square Feet</span>
                                                        </td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">9430 Research
                                                                Blvd. Ste 2-350 Austin</p>
                                                            <span>TX 78759</span>
                                                        </td>
                                                        <td><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></td>
                                                    </tr>
                                                    <tr>
                                                        <td><label class="custom-control custom-checkbox-md">
                                                                <input type="checkbox" class="custom-control-input"
                                                                    name="example-checkbox5" value="option5" checked="">
                                                                <span class="custom-control-label"></span>
                                                            </label></td>
                                                        <td><img src="https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336__340.jpg"
                                                                alt=""></td>
                                                        <td>US-272723</td>
                                                        <td></td>
                                                        <td><a class="like" href="javascript:;">
                                                                <span
                                                                    class="badge btn-light rounded-pill-Multi-Commercial rounded-pill py-2 px-3">
                                                                    <i class="fe fe-circle me-1"></i>Single
                                                                    Family</span>
                                                            </a></td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">1 Unit (s)</p>
                                                            <span>220 Square Feet</span>
                                                        </td>
                                                        <td>
                                                            <p style="font-weight: 600;" class="mb-1">9430 Research
                                                                Blvd. Ste 2-350 Austin</p>
                                                            <span>TX 78759</span>
                                                        </td>
                                                        <td><i class="fe fe-more-vertical" data-bs-toggle="tooltip"
                                                                title="" data-bs-original-title="fe fe-more-vertical"
                                                                aria-label="fe fe-more-vertical"></i></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Row -->
                    </div>
                    <!-- ROW-2 END -->




                    <div class="card-body pb-0 bg-recentorder" style="display: none;">
                        <h3 class="card-title text-white">Recent Orders</h3>
                        <div class="chartjs-wrapper-demo">
                            <canvas id="recentorders" class="chart-dropshadow"></canvas>
                        </div>
                    </div>
                    <div id="flotback-chart" class="flot-background" style="display: none;"></div>

                </div>
                <!-- CONTAINER END -->
            </div>
        </div>
        <!--app-content close-->

    </div>

    <!-- Sidebar-right -->
    <div class="sidebar sidebar-right sidebar-animate">
        <div class="panel panel-primary card mb-0 shadow-none border-0">
            <div class="tab-menu-heading border-0 d-flex p-3">
                <div class="card-title mb-0"><i class="fe fe-bell me-2"></i><span class=" pulse"></span>Notifications
                </div>
                <div class="card-options ms-auto">
                    <a href="javascript:void(0);" class="sidebar-icon text-end float-end me-3 mb-1"
                        data-bs-toggle="sidebar-right" data-target=".sidebar-right"><i
                            class="fe fe-x text-white"></i></a>
                </div>
            </div>
            <div class="panel-body tabs-menu-body latest-tasks p-0 border-0">
                <div class="tabs-menu border-bottom">
                    <!-- Tabs -->
                    <ul class="nav panel-tabs">
                        <li class=""><a href="#side1" class="active" data-bs-toggle="tab"><i
                                    class="fe fe-settings me-1"></i>Feeds</a></li>
                        <li><a href="#side2" data-bs-toggle="tab"><i class="fe fe-message-circle"></i> Chat</a></li>
                        <li><a href="#side3" data-bs-toggle="tab"><i class="fe fe-anchor me-1"></i>Timeline</a></li>
                    </ul>
                </div>
                <div class="tab-content">
                    <div class="tab-pane active" id="side1">
                        <div class="p-3 fw-semibold ps-5">Feeds</div>
                        <div class="card-body pt-2">
                            <div class="browser-stats">
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span class="feeds avatar-circle brround bg-primary-transparent"><i
                                                class="fe fe-user text-primary"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">New user registered</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-secondary brround bg-secondary-transparent"><i
                                                class="fe fe-shopping-cart text-secondary"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">New order delivered</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-danger brround bg-danger-transparent"><i
                                                class="fe fe-bell text-danger"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">You have pending tasks</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-warning brround bg-warning-transparent"><i
                                                class="fe fe-gitlab text-warning"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">New version arrived</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-pink brround bg-pink-transparent"><i
                                                class="fe fe-database text-pink"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">Server #1 overloaded</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-info brround bg-info-transparent"><i
                                                class="fe fe-check-circle text-info"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">New project launched</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                                <a href="javascript:void(0)"><i class="fe fe-x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 fw-semibold ps-5">Settings</div>
                        <div class="card-body pt-2">
                            <div class="browser-stats">
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span class="feeds avatar-circle brround bg-primary-transparent"><i
                                                class="fe fe-settings text-primary"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">General Settings</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-secondary brround bg-secondary-transparent"><i
                                                class="fe fe-map-pin text-secondary"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">Map Settings</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-danger brround bg-danger-transparent"><i
                                                class="fe fe-headphones text-danger"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">Support Settings</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-warning brround bg-warning-transparent"><i
                                                class="fe fe-credit-card text-warning"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">Payment Settings</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-sm-2 mb-sm-0 mb-3">
                                        <span
                                            class="feeds avatar-circle avatar-circle-pink brround bg-pink-transparent"><i
                                                class="fe fe-bell text-pink"></i></span>
                                    </div>
                                    <div class="col-sm-10 ps-sm-0">
                                        <div class="d-flex align-items-end justify-content-between ms-2">
                                            <h6 class="">Notification Settings</h6>
                                            <div>
                                                <a href="javascript:void(0)"><i class="fe fe-settings me-1"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="side2">
                        <div class="list-group list-group-flush">
                            <div class="pt-3 fw-semibold ps-5">Today</div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/2.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Addie Minstra</div>
                                        <p class="mb-0 fs-12 text-muted"> Hey! there I' am available.... </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/11.jpg"><span
                                            class="avatar-status bg-success"></span></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Rose Bush</div>
                                        <p class="mb-0 fs-12 text-muted"> Okay...I will be waiting for you </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/10.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Claude Strophobia</div>
                                        <p class="mb-0 fs-12 text-muted"> Hi we can explain our new project......
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/13.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Eileen Dover</div>
                                        <p class="mb-0 fs-12 text-muted"> New product Launching... </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/12.jpg"><span
                                            class="avatar-status bg-success"></span></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Willie Findit</div>
                                        <p class="mb-0 fs-12 text-muted"> Okay...I will be waiting for you </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/15.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Manny Jah</div>
                                        <p class="mb-0 fs-12 text-muted"> Hi we can explain our new project......
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/4.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Cherry Blossom</div>
                                        <p class="mb-0 fs-12 text-muted"> Hey! there I' am available....</p>
                                    </a>
                                </div>
                            </div>
                            <div class="pt-3 fw-semibold ps-5">Yesterday</div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/7.jpg"><span
                                            class="avatar-status bg-success"></span></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Simon Sais</div>
                                        <p class="mb-0 fs-12 text-muted">Schedule Realease...... </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/9.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Laura Biding</div>
                                        <p class="mb-0 fs-12 text-muted"> Hi we can explain our new project......
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/2.jpg"><span
                                            class="avatar-status bg-success"></span></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Addie Minstra</div>
                                        <p class="mb-0 fs-12 text-muted">Contact me for details....</p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/9.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Ivan Notheridiya</div>
                                        <p class="mb-0 fs-12 text-muted"> Hi we can explain our new project......
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/14.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Dulcie Veeta</div>
                                        <p class="mb-0 fs-12 text-muted"> Okay...I will be waiting for you </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/11.jpg"></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Florinda Carasco</div>
                                        <p class="mb-0 fs-12 text-muted">New product Launching...</p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group-item d-flex align-items-center">
                                <div class="me-2">
                                    <span class="avatar avatar-md brround cover-image"
                                        data-bs-image-src="../assets/images/users/4.jpg"><span
                                            class="avatar-status bg-success"></span></span>
                                </div>
                                <div class="">
                                    <a href="chat.html">
                                        <div class="fw-semibold text-dark" data-bs-toggle="modal"
                                            data-target="#chatmodel">Cherry Blossom</div>
                                        <p class="mb-0 fs-12 text-muted">cherryblossom@gmail.com</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="side3">
                        <ul class="task-list timeline-task">
                            <li class="d-sm-flex mt-4">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">Task Finished<span
                                            class="text-muted fs-11 mx-2 fw-normal">09 July 2021</span></h6>
                                    <p class="text-muted fs-12">Adam Berry finished task on<a href="javascript:void(0)"
                                            class="fw-semibold"> Project Management</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                            <li class="d-sm-flex">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">New Comment<span class="text-muted fs-11 mx-2 fw-normal">05
                                            July 2021</span></h6>
                                    <p class="text-muted fs-12">Victoria commented on Project <a
                                            href="javascript:void(0)" class="fw-semibold"> AngularJS Template</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                            <li class="d-sm-flex">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">New Comment<span class="text-muted fs-11 mx-2 fw-normal">25
                                            June 2021</span></h6>
                                    <p class="text-muted fs-12">Victoria commented on Project <a
                                            href="javascript:void(0)" class="fw-semibold"> AngularJS Template</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                            <li class="d-sm-flex">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">Task Overdue<span class="text-muted fs-11 mx-2 fw-normal">14
                                            June 2021</span></h6>
                                    <p class="text-muted mb-0 fs-12">Petey Cruiser finished task <a
                                            href="javascript:void(0)" class="fw-semibold"> Integrated management</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                            <li class="d-sm-flex">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">Task Overdue<span class="text-muted fs-11 mx-2 fw-normal">29
                                            June 2021</span></h6>
                                    <p class="text-muted mb-0 fs-12">Petey Cruiser finished task <a
                                            href="javascript:void(0)" class="fw-semibold"> Integrated management</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                            <li class="d-sm-flex">
                                <div>
                                    <i class="task-icon1"></i>
                                    <h6 class="fw-semibold">Task Finished<span
                                            class="text-muted fs-11 mx-2 fw-normal">09 July 2021</span></h6>
                                    <p class="text-muted fs-12">Adam Berry finished task on<a href="javascript:void(0)"
                                            class="fw-semibold"> Project Management</a>
                                    </p>
                                </div>
                                <div class="ms-auto d-md-flex me-3">
                                    <a href="javascript:void(0)" class="text-muted me-2"><span
                                            class="fe fe-edit"></span></a>
                                    <a href="javascript:void(0)" class="text-muted"><span
                                            class="fe fe-trash-2"></span></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--/Sidebar-right-->

    <!-- Country-selector modal-->
    <div class="modal fade" id="country-selector">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content country-select-modal">
                <div class="modal-header">
                    <h6 class="modal-title">Choose Country</h6><button aria-label="Close" class="btn-close"
                        data-bs-dismiss="modal" type="button"><span aria-hidden="true">×</span></button>
                </div>
                <div class="modal-body">
                    <ul class="row p-3">
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block active">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/us_flag.jpg"
                                        class="me-3 language"></span>USA
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/italy_flag.jpg"
                                        class="me-3 language"></span>Italy
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/spain_flag.jpg"
                                        class="me-3 language"></span>Spain
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/india_flag.jpg"
                                        class="me-3 language"></span>India
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/french_flag.jpg"
                                        class="me-3 language"></span>French
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/russia_flag.jpg"
                                        class="me-3 language"></span>Russia
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/germany_flag.jpg"
                                        class="me-3 language"></span>Germany
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/argentina.jpg"
                                        class="me-3 language"></span>Argentina
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/malaysia.jpg"
                                        class="me-3 language"></span>Malaysia
                            </a>
                        </li>
                        <li class="col-lg-6 mb-2">
                            <a href="javascript:void(0)" class="btn btn-country btn-lg btn-block">
                                <span class="country-selector"><img alt="" src="../assets/images/flags/turkey.jpg"
                                        class="me-3 language"></span>Turkey
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- Country-selector modal-->

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="row align-items-center flex-row-reverse">
                <div class="col-md-12 col-sm-12 text-center">
                    Copyright © <span id="year"></span> <a href="javascript:void(0)">Sash</a>. Designed with <span
                        class="fa fa-heart text-danger"></span> by <a href="javascript:void(0)"> Spruko </a> All
                    rights reserved.
                </div>
            </div>
        </div>
    </footer>
    <!-- FOOTER END -->

    </div>

    <!-- BACK-TO-TOP -->
    <a href="#top" id="back-to-top"><i class="fa fa-angle-up"></i></a>

    <!-- JQUERY JS -->
    <script src="../assets/js/jquery.min.js"></script>

    <!-- BOOTSTRAP JS -->
    <script src="../assets/plugins/bootstrap/js/popper.min.js"></script>
    <script src="../assets/plugins/bootstrap/js/bootstrap.min.js"></script>

    <!-- SPARKLINE JS-->
    <script src="../assets/js/jquery.sparkline.min.js"></script>

    <!-- Sticky js -->
    <script src="../assets/js/sticky.js"></script>

    <!-- CHART-CIRCLE JS-->
    <script src="../assets/js/circle-progress.min.js"></script>

    <!-- PIETY CHART JS-->
    <script src="../assets/plugins/peitychart/jquery.peity.min.js"></script>
    <script src="../assets/plugins/peitychart/peitychart.init.js"></script>

    <!-- SIDEBAR JS -->
    <script src="../assets/plugins/sidebar/sidebar.js"></script>

    <!-- Perfect SCROLLBAR JS-->
    <script src="../assets/plugins/p-scroll/perfect-scrollbar.js"></script>
    <script src="../assets/plugins/p-scroll/pscroll.js"></script>
    <script src="../assets/plugins/p-scroll/pscroll-1.js"></script>

    <!-- INTERNAL CHARTJS CHART JS-->
    <script src="../assets/plugins/chart/Chart.bundle.js"></script>
    <script src="../assets/plugins/chart/rounded-barchart.js"></script>
    <script src="../assets/plugins/chart/utils.js"></script>

    <!-- INTERNAL SELECT2 JS -->
    <script src="../assets/plugins/select2/select2.full.min.js"></script>

    <!-- INTERNAL Data tables js-->
    <script src="../assets/plugins/datatable/js/jquery.dataTables.min.js"></script>
    <script src="../assets/plugins/datatable/js/dataTables.bootstrap5.js"></script>
    <script src="../assets/plugins/datatable/dataTables.responsive.min.js"></script>

    <!-- INTERNAL APEXCHART JS -->
    <script src="../assets/js/apexcharts.js"></script>
    <script src="../assets/plugins/apexchart/irregular-data-series.js"></script>

    <!-- INTERNAL Flot JS -->
    <script src="../assets/plugins/flot/jquery.flot.js"></script>
    <script src="../assets/plugins/flot/jquery.flot.fillbetween.js"></script>
    <script src="../assets/plugins/flot/chart.flot.sampledata.js"></script>
    <script src="../assets/plugins/flot/dashboard.sampledata.js"></script>

    <!-- INTERNAL Vector js -->
    <script src="../assets/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js"></script>
    <script src="../assets/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>

    <!-- SIDE-MENU JS-->
    <script src="../assets/plugins/sidemenu/sidemenu.js"></script>

    <!-- TypeHead js -->
    <script src="../assets/plugins/bootstrap5-typehead/autocomplete.js"></script>
    <script src="../assets/js/typehead.js"></script>

    <!-- INTERNAL INDEX JS -->
    <script src="../assets/js/index1.js"></script>

    <!-- Color Theme js -->
    <script src="../assets/js/themeColors.js"></script>

    <!-- CUSTOM JS -->
    <script src="../assets/js/custom.js"></script>

    <!-- ############################################# -->


    <!-- C3 CHART JS -->
    <script src="../assets/plugins/charts-c3/d3.v5.min.js"></script>
    <script src="../assets/plugins/charts-c3/c3-chart.js"></script>

    <!-- INPUT MASK JS-->
    <script src="../assets/plugins/input-mask/jquery.mask.min.js"></script>

    <!-- CHARTJS JS -->
    <script src="../assets/plugins/chart/Chart.bundle.js"></script>
    <script src="../assets/plugins/chart/utils.js"></script>

    <!-- CHART-DONUT JS -->
    <script src="../assets/js/charts.js"></script>


    <script>
    // Get the user's preferred color scheme
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Get a reference to the logo element
    const logo = document.getElementById('logo');

    // Set the logo source file based on the user's preferred color scheme
    if (userPrefersDark) {
        logo.src = '../assets/header-img/comment.svg';
    } else {
        logo.src = '../assets/header-img/question.svg';
    }
    </script>


</body>

</html>