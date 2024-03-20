
<template>
    <section class="section2">
        <div class="clients">
            <div class="intro">
                <span id="title">Our Students <br /></span><span id="description">Our students come from various
                    institution</span>
            </div>
            <div class="logos">
                <img style="width: 48px; height: 65px" src="./icons/client1.png" />
                <img style="width: 53px; height: 65px" src=".icons/client2.png" />
                <img style="width: 53px; height: 62px" src=".icons/client3.png" />
                <img style="width: 123px; height: 29px" src=".icons/client4.png" />
                <img style="width: 83px; height: 85px" src=".icons/client5.png" />
                <img style="width: 67px; height: 66px" src=".icons/client6.png" />
                <img style="width: 65px; height: 66px" src=".icons/client7.png" />
            </div>
        </div>
    </section>
    <br />
</template>

<style scoped>
.intro {
    text-align: center;
}

#title {
    text-align: center;

    font-size: 45px;
    font-family: Inter;
    font-weight: 600;

    word-wrap: break-word;
}

#description {
    text-align: center;
    color: #717171;
    font-size: 18px;
    font-family: Inter;
    font-weight: 400;
    line-height: 20px;
    word-wrap: break-word;
}

.clients {
    width: 70%;
    flex-direction: column;
    justify-content: flex-start;
    padding-left: 15%;
    padding-right: 15%;
    align-items: center;
    gap: 11.14px;
    display: inline-flex;
}

.logos {
    align-self: stretch;
    height: 68.21px;
    justify-content: space-between;
    align-items: center;
    display: inline-flex;
}
</style>